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
    <div className="flex gap-3 w-fit font-nunito h-12  2xl:h-16">
      <div
        className={`${colorMap[color]} rounded-full w-12 h-12 2xl:w-16 2xl:h-16 flex justify-center items-center`}
      >
        <img src={`/tags/${logo}.svg`} alt="lock" />
      </div>

      <div className="text-xs 2xl:text-sm w-40 font-bold">
        <div className=" text-[#3D4D55]">{heading}</div>
        <div className="text-[#8E9193]">{text}</div>
      </div>
    </div>
  );
}

