/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  PathDto,
  RealTimeBusPayloadDto,
  RealTimeData,
  RealTimeSubwayPayloadDto,
  RouteData,
  RoutePayloadDto,
} from './dto/route.dto';
import axios from 'axios';

@Injectable()
export class TransportService {
  async route(payload: RoutePayloadDto): Promise<RouteData> {
    const res = await axios.get(
      'https://api.odsay.com/v1/api/searchPubTransPathT',
      {
        params: {
          apiKey: 'RvGyUmh9c1eYcFGniziD7pWJreACd2Cv77ujCKnM/9o',
          SX: payload.start_x,
          SY: payload.start_y,
          EX: payload.end_x,
          EY: payload.end_y,
        },
      },
    );

    if (res.status !== 200 || res.data.error) {
      throw new HttpException(
        '길찾기 API 호출 중 에러가 발생했습니다.',
        HttpStatus.GATEWAY_TIMEOUT,
      );
    } else {
      const data = res.data.result;

      const paths: PathDto = data.path.map((e) => ({
        pathId: e.info.mapObj,
        pathType: e.pathType,
        totalTime: e.info.totalTime,
        totalDistance: e.info.totalDistance,
        payment: e.payment,
        subPath: e.subPath.map((s) => {
          if (s.trafficType === 1) {
            return {
              trafficType: s.trafficType,
              distance: s.distance,
              sectionTime: s.sectionTime,
              stationCount: s.stationCount,
              stationList: s.passStopList.stations.map((st) => st.stationName),
              startStationName: s.startName,
              laneList: s.lane.map((l) => ({ laneName: l.name })),
            };
          } else if (s.trafficType === 2) {
            return {
              trafficType: s.trafficType,
              distance: s.distance,
              sectionTime: s.sectionTime,
              stationCount: s.stationCount,
              stationList: s.passStopList.stations.map((st) => st.stationName),
              startStationId: s.startLocalStationID,
              laneList: s.lane.map((l) => ({
                laneName: l.busNo,
                laneId: l.busLocalBlID,
              })),
            };
          } else {
            return {
              trafficType: s.trafficType,
              distance: s.distance,
              sectionTime: s.sectionTime,
            };
          }
        }),
      }));
      const routeDto: RouteData = {
        busCount: data.busCount,
        subwayCount: data.subwayCount,
        subwayBusCount: data.subwayBusCount,
        path: paths,
      };
      return routeDto;
    }
  }
  async realTime(
    payload: RealTimeBusPayloadDto | RealTimeSubwayPayloadDto,
  ): Promise<RealTimeData> {
    // 버스
    if (payload.trafficType === 2) {
      const res = await axios.get(
        'https://bus.busan.go.kr/busanBIMS/bus_map1/bims_web/Ajax/Arrival_Infomation.aspx',
        {
          params: {
            lid: payload.laneId,
            bid: payload.stationId,
          },
        },
      );
      const data = res.data as string;
      console.log(data);
      const departsData = data.split('|')[0].split('^');
      return departsData.map((e) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_, remainTime, remainStation] = e.split('@');
        return { remainTime, remainStation };
      });
    } else {
      return [{ remainTime: 5, remainStation: 2 }];
    }
  }
}
