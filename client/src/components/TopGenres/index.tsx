import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { TopGenresDataType } from "../PersonalData";
import { DataOptions, DataButton } from "../shared/DataOptions";

type TopGenresProps = {
  data: TopGenresDataType;
};

type CurrentDisplayDataStateType = "shortTerm" | "longTerm";

const TopGenres = ({ data }: TopGenresProps) => {
  const [currentDisplayData, setCurrentDisplayData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [isRecentDisplayed, setIsRecentDisplayed] = useState(true);
  useEffect(() => {
    setCurrentDisplayData(data!.shortTerm);
    setIsRecentDisplayed(true);
  }, [data]);

  const handleRecentClick = () => {
    setCurrentDisplayData(data!["shortTerm"]);
    setIsRecentDisplayed(true);
  };

  const handleAllTimeClick = () => {
    setCurrentDisplayData(data!["longTerm"]);
    setIsRecentDisplayed(false);
  };

  return (
    <GenresDisplay>
      <div className="dataItemHeader">
        <h2>Top Genres</h2>
        <DataOptions>
          <DataButton
            active={isRecentDisplayed ? true : false}
            onClick={() => handleRecentClick()}
          >
            Recent
          </DataButton>
          <DataButton
            active={!isRecentDisplayed ? true : false}
            onClick={() => handleAllTimeClick()}
          >
            All-Time
          </DataButton>
        </DataOptions>
      </div>
      <div className="dataItemInner">
        <Doughnut
          data={currentDisplayData}
          options={{
            legend: {
              position: "right",
              align: "center",
              labels: {
                fontSize: 16,
                fontColor: "rgb(220,220,220)",
                fontFamily: "open sans, sans-serf",
              },
            },
            tooltips: {
              displayColors: false,
            },
          }}
        />
      </div>
    </GenresDisplay>
  );
};

export default TopGenres;

const GenresDisplay = styled.div`
  grid-area: genres;
  h2 {
    display: inline-block;
    margin-right: 0.5em;
  }
  .dataItemInner {
    display: flex;
    align-items: center;
  }
`;

// const GenresHeader = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   margin-bottom: 1em;
// `;
