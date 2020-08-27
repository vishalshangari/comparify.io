import { Genre } from "../components/PersonalData";
import { pieChartColors } from "../components/PersonalData/constants";

export default (data: Genre[]) => {
  let names = [];
  let counts = [];
  let colors = [];
  for (let i = 0; i < 10; i++) {
    names.push(`${i + 1}. ` + data[i].name);
    counts.push(data[i].count);
    colors.push(`#` + pieChartColors[i]);
  }
  return {
    labels: names,
    datasets: [
      {
        data: counts,
        backgroundColor: colors,
        borderColor: "rgb(220,220,220)",
        borderWidth: 2,
      },
    ],
  };
};
