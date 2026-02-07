export const Loading = ({ text = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="text-center">
        <div className="inline-block">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="mt-3 text-gray-600 text-sm font-medium">{text}</p>
      </div>
    </div>
  );
};

export default Loading;
