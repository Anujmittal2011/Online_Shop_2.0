import AiAssistant from '../components/AiAssistant';

const AiChat = () => {
  return (
    <div className='container mx-auto p-4'>
      <div className='max-w-3xl mx-auto'>
        <h1 className='text-3xl font-semibold mb-2'>AI Shopping Assistant</h1>
        <p className='text-slate-600 mb-6'>Ask product questions, delivery questions, payment questions, or general shopping queries.</p>
        <AiAssistant />
      </div>
    </div>
  );
};

export default AiChat;
