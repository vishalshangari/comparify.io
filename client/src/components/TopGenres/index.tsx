import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { ChartData } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { DataOptions, DataButton } from "../shared/DataOptions";
import ErrorComp from "../shared/ErrorComp";
import { TopGenresProps, CurrentDisplayDataStateType } from "./models";
import { breakpoints } from "../../theme";
import { useMedia } from "react-use";
import { pieChartColors } from "../PersonalData/constants";

const TopGenres = ({ data }: TopGenresProps) => {
  const [currentDisplayData, setCurrentDisplayData] = useState<ChartData>({
    labels: [],
    datasets: [{ data: [] }],
  });
  const isSmall = useMedia("(max-width: 42em)");
  const isVerySmall = useMedia("(max-width: 33em)");
  const [currentDisplayState, setCurrentDisplayState] = useState<
    CurrentDisplayDataStateType
  >("shortTerm");

  useEffect(() => {
    setCurrentDisplayData(data!.shortTerm);
  }, [data]);

  const handleOptionClick = (period: CurrentDisplayDataStateType) => {
    setCurrentDisplayState(period);
    setCurrentDisplayData(data![period]!);
  };

  return data ? (
    <GenresDisplay>
      <div className="dataItemHeader">
        <h2>Top Genres</h2>
        <DataOptions>
          {data["shortTerm"] ? (
            <DataButton
              active={currentDisplayState === "shortTerm" ? true : false}
              onClick={() => handleOptionClick("shortTerm")}
            >
              Now
            </DataButton>
          ) : null}

          {data["mediumTerm"] ? (
            <DataButton
              active={currentDisplayState === "mediumTerm" ? true : false}
              onClick={() => handleOptionClick("mediumTerm")}
            >
              Recent
            </DataButton>
          ) : null}

          {data["longTerm"] ? (
            <DataButton
              active={currentDisplayState === "longTerm" ? true : false}
              onClick={() => handleOptionClick("longTerm")}
            >
              All-Time
            </DataButton>
          ) : null}
        </DataOptions>
      </div>
      <div className="dataItemInner">
        <Doughnut
          data={currentDisplayData}
          options={{
            maintainAspectRatio: isSmall ? false : true,
            legend: {
              display: isVerySmall ? false : true,
              position: isSmall ? "bottom" : "right",
              align: "center",
              labels: {
                fontSize: isSmall ? 14 : 16,
                padding: isSmall ? 20 : 10,
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
      {isVerySmall ? (
        <CustomLegend>
          {currentDisplayData.labels?.map((label, idx) => (
            <div key={idx} className="customLegendItem">
              <div
                style={{ backgroundColor: `#` + pieChartColors[idx] }}
                className="customLegendItemColor"
              ></div>
              <div className="customLegendLabel">{label}</div>
            </div>
          ))}
        </CustomLegend>
      ) : null}
    </GenresDisplay>
  ) : (
    <ErrorComp>
      <span>There was an error loading your top genres data.</span>
    </ErrorComp>
  );
};

export default TopGenres;

const CustomLegend = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 1em 0;
  grid-gap: 1em;
  .customLegendItem {
    display: flex;
    align-items: center;
  }
  .customLegendItemColor {
    flex-basis: 2em;
    height: 1em;
    margin-right: 1em;
    border: 1px solid ${({ theme }) => theme.colors.textPrimary};
    border-radius: 0.125em;
  }
  .customLegendLabel {
    flex-grow: 1;
  }
`;

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
  ${breakpoints.lessThan("74")`
    .dataItemHeader {
      flex-wrap: wrap;
      h2 {
        flex-basis: 100%;
        margin-bottom: 0.5em;
      }
      ${DataOptions} {
        flex-basis: 100%;
      }
      ${DataButton} {
        flex: 1;
      }
    }
  `}
  ${breakpoints.lessThan("42")`
    .dataItemInner {
      min-height: 500px;
    }
  `}
  ${breakpoints.lessThan("33")`
    .dataItemInner {
      min-height: 0;
      height: 250px;
    }
  `}
`;
