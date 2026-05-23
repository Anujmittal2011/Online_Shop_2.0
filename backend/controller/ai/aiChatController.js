const https = require("node:https");
const { URL } = require("url");
const Product = require("../../models/productModel");

function cleanMarkdownTable(text) {
  if (!text || typeof text !== "string") return text;
  const lines = text.split("\n");
  const cleaned = lines
    .filter((line) => !/^\s*\|?\s*-{2,}\s*\|?\s*$/.test(line))
    .map((line) => {
      if (line.trim().startsWith("|")) {
        return line
          .split("|")
          .map((cell) => cell.trim())
          .filter(Boolean)
          .join(" - ");
      }
      return line;
    })
    .join("\n")
    .replace(/\n{2,}/g, "\n")
    .trim();
  return cleaned;
}

async function callGroq(prompt) {
  const groqUrl = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1";
  const urlObj = new URL(groqUrl);
  const basePath = urlObj.pathname.replace(/\/$/, "");
  const completionPath = basePath.match(/\/(chat\/completions|responses)$/)
    ? basePath
    : `${basePath}/chat/completions`;

  const body = JSON.stringify({
    model: process.env.GROQ_MODEL || "groq/compound-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
    temperature: 0.2,
  });

  const headers = {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  };
  if (process.env.GROQ_API_KEY) headers["Authorization"] = `Bearer ${process.env.GROQ_API_KEY}`;

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: urlObj.hostname,
        port: urlObj.port || 443,
        path: completionPath + (urlObj.search || ""),
        method: "POST",
        headers,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (err) {
            resolve({ raw: data });
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.write(body);
    req.end();
  });
}

async function findSuggestedProducts(queryText) {
  if (!queryText || !queryText.trim()) return [];

  const regex = new RegExp(queryText.trim().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
  const products = await Product.find({
    $or: [
      { productName: regex },
      { brandName: regex },
      { category: regex },
    ],
  })
    .limit(5)
    .lean();

  return products.map((product) => ({
    _id: product._id,
    productName: product.productName,
    brandName: product.brandName,
    category: product.category,
    sellingPrice: product.sellingPrice || product.price,
    slug: product.slug,
  }));
}

const aiChatController = async (req, res) => {
  try {
    const { message, productId } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, error: "Message is required" });
    }

    let productContext = "";
    let suggestedProducts = [];
    if (productId) {
      const product = await Product.findById(productId).lean();
      if (product) {
        productContext = `Product details:\n` +
          `- Name: ${product.productName || product.name || "Unknown"}\n` +
          `- Brand: ${product.brandName || product.brand || "Unknown"}\n` +
          `- Category: ${product.category || "Unknown"}\n` +
          `- Price: ${product.sellingPrice || product.price || "Unknown"}\n` +
          `- Description: ${product.description || "No description available."}\n`;
      }
    }

    if (!productContext) {
      suggestedProducts = await findSuggestedProducts(message);
      if (suggestedProducts.length > 0) {
        const firstProduct = suggestedProducts[0];
        productContext = `Product details:\n` +
          `- Name: ${firstProduct.productName}\n` +
          `- Brand: ${firstProduct.brandName || "Unknown"}\n` +
          `- Category: ${firstProduct.category || "Unknown"}\n` +
          `- Price: ${firstProduct.sellingPrice || "Unknown"}\n` +
          `- Description: Product found by matching your query.\n`;
      }
    }

    const prompt = `You are an e-commerce customer support assistant. Answer the customer question directly, politely, and with helpful product guidance. Use plain text only and avoid markdown tables, HTML tags, or code blocks. Keep answers short and easy to read. Use the product details below if they are available.\n\n${productContext}\nCustomer question: "${message}"`;

    let groqResp = null;
    let groqError = null;
    try {
      groqResp = await callGroq(prompt);
    } catch (err) {
      groqError = err;
      console.error("GROQ call failed:", err && (err.message || err));
      groqResp = null;
    }

    let answer = "";
    if (groqResp) {
      answer =
        groqResp.answer ||
        groqResp.output?.[0]?.content?.[0]?.text ||
        groqResp.output?.text ||
        groqResp.choices?.[0]?.message?.content ||
        groqResp.choices?.[0]?.text ||
        groqResp.data ||
        groqResp.raw ||
        "";
      if (typeof answer === "object") answer = JSON.stringify(answer);
      answer = cleanMarkdownTable(String(answer).trim());
    }

    // Provide a helpful fallback when GROQ / external AI is unreachable.
    if (!answer) {
      const productSummary = productContext || "(no product details available)";
      const suggestionText = suggestedProducts.length > 0
        ? `I found these likely product matches based on your message: ${suggestedProducts.slice(0, 3).map((p) => p.productName).join(", ")}.`
        : "I couldn't identify a specific product from your request.";
      const backendReason = groqError
        ? `The system could not reach the external AI provider because of a backend connection issue (${groqError.message || groqError}).`
        : "The system could not get a valid response from the external AI provider.";

      answer = `${backendReason} ${suggestionText} Based on the product information I have:\n${productSummary}\nI can't look up order-specific warranty records without an order ID. Common next steps:\n1) Check your order confirmation email for warranty details and the order ID.\n2) Visit the Orders page in your account to view warranty and return information.\n3) If you share your order ID or select one of the suggested products, I can give you a more precise warranty answer.`;
    }

    // Suggested demo questions to show in the UI
    const suggestedQuestions = [
      "What's the warranty period for my Boat Airpodes 172?",
      "How do I initiate a warranty claim for my last order?",
      "Does the warranty cover water damage or accidental drops?",
      "Is the warranty international or limited to my country?",
      "Can I extend the warranty for my product?",
      "How long will it take to process a warranty repair?",
      "What information do you need to start a warranty claim?",
      "Where can I find my order ID and invoice?",
      "Can I return the product for a refund instead of a warranty repair?",
      "Are replacement parts available for this model?",
    ];

    return res.json({ success: true, answer, suggestedQuestions, suggestedProducts });
  } catch (error) {
    const errorMessage = error.response?.data?.error?.message || error.response?.data || error.message || "Failed to get response from AI.";
    console.error("AI chat error:", errorMessage);
    return res.status(500).json({ success: false, error: errorMessage });
  }
};

module.exports = aiChatController;
