// components/poster/IWillBeTherePoster.tsx
export const IWillBeTherePoster = ({
  name,
  image,
}: {
  name: string;
  image: string;
}) => {
  return (
    <div
      id="poster"
      className="w-[1080px] h-[1080px] relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50"
    >
      {/* COPY your exact preview UI here */}
    </div>
  );
};
