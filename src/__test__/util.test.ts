import { mockData } from "../mocks";
import {
  augmetTiles,
  generateCoordinateKey,
  linesToCoordinatePairs,
  organiseLines,
} from "../domain/lib/util";
import { CoordinateTuple, Line, TileData } from "../domain/types";

const _ = require("lodash");

describe("util functions", () => {
  it("organiseLines,", () => {
    const checks = ([verticals, horizontals]: [Line[], Line[]]) => {
      expect(verticals.length).toEqual(6);
      expect(horizontals.length).toEqual(11);
      verticals.forEach(({ start, end }) => {
        expect(start.lng === end.lng).toEqual(true);
        expect(start.lat === end.lat).toEqual(false);
      });
      horizontals.forEach(({ start, end }) => {
        expect(start.lat === end.lat).toEqual(true);
        expect(start.lng === end.lng).toEqual(false);
      });
    };

    checks(organiseLines(mockData));
    // checks(organiseLines(_.shuffle(mockData)));
  });

  it("linesToCoordinatePairs", () => {
    const lines = organiseLines(mockData);
    // number of generated squares should be (verticalLines - 1) * (horizontalLines - 1)
    const totalCoords = (lines[0].length - 1) * (lines[1].length - 1);
    expect(linesToCoordinatePairs(lines).length).toEqual(totalCoords);
  });

  it("generateCoordinateKey", () => {
    const coords = {
      lng: -0.133384,
      lat: 51.516224,
    };
    const coordsKey = "51.51622-0.13338";

    const coordsLonger = {
      lng: -0.133384123,
      lat: 51.516224456,
    };
    const coordsLongerKey = "51.51622-0.13338";

    const coordsShorter = {
      lng: -0.133,
      lat: 51.516,
    };
    const coordsShorterKey = "51.51600-0.13300";

    // rounds to 5 decimal places,
    expect(generateCoordinateKey(coords)).toEqual(coordsKey);
    expect(generateCoordinateKey(coordsLonger)).toEqual(coordsLongerKey);
    expect(generateCoordinateKey(coordsShorter)).toEqual(coordsShorterKey);
  });

  it("augmetTiles", () => {
    const tiles: CoordinateTuple[] = linesToCoordinatePairs(
      organiseLines(mockData)
    );
    const data: TileData[] = [];

    const augmentedData = augmetTiles(tiles, data);

    expect(augmentedData.length).toEqual(tiles.length);
    //expect(augmentedData[0]).toHaveProperty("tiles");
  });
});
