import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 mx-auto h-full w-full px-4 md:px-6 lg:px-8 xl:max-w-7xl">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
          <div className="aspect-video rounded-xl bg-muted/50" />
        </div>
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
          Main body
        </div>
      </div>
    </>
  );
};

export default Dashboard;
