import { Info } from "lucide-react";

export const PrintHint = () => {
  return (
    <div className="mt-4 flex items-start rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
      <Info className="mt-0.5 mr-2 shrink-0" size={18} />
      <div>
        <strong>Print window open agillave?</strong>
        <br />
        Dayavittu keyboard nalli <b>Ctrl + P</b> (Windows) athava <b>Cmd + P</b> (Mac)
        othi kelinma print madi.
      </div>
    </div>
  );
};
