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
    <div className="flex gap-3 w-fit font-nunito  h-14">
      <div
        className={`${colorMap[color]} rounded-full w-14 h-14 flex justify-center items-center`}
      >
        <img src={`/tags/${logo}.svg`} alt="lock" />
      </div>

      <div className="text-sm w-40 font-bold">
        <div className=" text-[#3D4D55]">{heading}</div>
        <div className="text-[#8E9193]">{text}</div>
      </div>
    </div>
  );
}

