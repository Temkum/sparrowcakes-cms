const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Not Authorized</h1>

      {/* go back */}
      <button
        className="bg-primary text-white px-4 py-2 rounded-md"
        onClick={() => window.history.back()}
      >
        Go Back
      </button>
    </div>
  );
};

export default NotAuthorized;
