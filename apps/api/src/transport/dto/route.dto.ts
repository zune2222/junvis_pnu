import { IsNotEmpty, IsNumber } from 'class-validator';

export class RoutePayloadDto {
  @IsNumber({}, { message: '시작 X 좌표는 숫자 형식이어야 합니다.' })
  start_x: number;
  @IsNumber({}, { message: '시작 Y 좌표는 숫자 형식이어야 합니다.' })
  start_y: string;
  @IsNumber({}, { message: '끝 X 좌표는 숫자 형식이어야 합니다.' })
  end_x: string;
  @IsNumber({}, { message: '끝 Y 좌표는 숫자 형식이어야 합니다.' })
  end_y: string;
}

export class RouteData {
  busCount: number;
  subwayCount: number;
  subwayBusCount: number;
  path: PathDto;
}

export class PathDto {
  pathId: string;
  pathType: 1 | 2 | 3;
  totalTime: number;
  totalDistance: number;
  payment: number;
  subPath: (WalkSubPath | BusSubPath | SubwaySubPath)[];
}

export class CommonSubPath {
  distance: number;
  sectionTime: number;
}

export class WalkSubPath extends CommonSubPath {
  trafficType: 3;
}

export class BusSubPath extends CommonSubPath {
  trafficType: 2;
  stationCount: number;
  stationList: string[];
  startStationID: string;
  laneList: BusLane[];
}

export class BusLane {
  laneName: string;
  laneId: string;
}

export class SubwaySubPath extends CommonSubPath {
  trafficType: 1;
  stationCount: number;
  stationList: string[];
  startStationName: string;
  laneList: SubwayLane[];
}

export class SubwayLane {
  laneName: string;
}

export class RealTimeBusPayloadDto {
  @IsNotEmpty({ message: 'trafficType이 누락되었습니다.' })
  trafficType: 2;
  @IsNotEmpty({ message: 'StationId 누락되었습니다.' })
  stationId: string;
  @IsNotEmpty({ message: 'laneId 누락되었습니다.' })
  laneId: string;
}

export class RealTimeSubwayPayloadDto {
  @IsNotEmpty({ message: 'trafficType이 누락되었습니다.' })
  trafficType: 1;
  @IsNotEmpty({ message: 'stationName 누락되었습니다.' })
  stationName: string;
  @IsNotEmpty({ message: 'laneName 누락되었습니다.' })
  laneName: string;
}

export class RealTimeData {}
