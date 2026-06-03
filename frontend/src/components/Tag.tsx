import { colorMap } from "../data";

export default function Tag({
  color,
  heading,
  text,
  logo,
}: {
  color: string;
  heading: string;
  text: string;
  logo: string;
}) {
  return (
    <div className="flex h-full gap-2  2xl:gap-4 w-fit items-center font-nunito">
      
      {/* Icon */}
      <div
        className={`${colorMap[color]} 
        rounded-full 
        w-full h-full
        max-w-12 max-h-12
        lg:max-w-12 lg:max-h-12 
        2xl:max-w-16 2xl:max-h-16 
        flex justify-center items-center`}
      >
        <img
          className=" sm:w-6 sm:h-6  lg:w-6 lg:h-6"
          src={`/tags/${logo}.svg`}
          alt={logo}
        />
      </div>

      {/* Text */}
      <div className="text-sm sm:text-xs  w-full sm:w-40 font-bold">
        <div className="text-fg-strong">{heading}</div>
        <div className="text-fg-muted font-medium">
          {text}
        </div>
      </div>
    </div>
  );
}