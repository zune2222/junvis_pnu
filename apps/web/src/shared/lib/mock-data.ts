export const mockSchedule = [
  {
    id: '1',
    subject: '공학작문및발표',
    time: '10:30 - 11:30',
    location: '제6공학관(컴퓨터공학관)(201)-6409',
    professor: '우균'
  },
  {
    id: '2',
    subject: '이산수학(II)',
    time: '13:30 - 14:30',
    location: '제6공학관(컴퓨터공학관)(201)-6202',
    professor: '손준영'
  },
  {
    id: '3',
    subject: '전기전자공학개론',
    time: '13:30 - 14:30',
    location: '제6공학관(컴퓨터공학관)(201)-6202',
    professor: '김정구'
  },
  {
    id: '4',
    subject: '일반물리학(II)',
    time: '15:00 - 16:00',
    location: '제6공학관(컴퓨터공학관)(201)-6516',
    professor: '천미연'
  },
  {
    id: '5',
    subject: '플랫폼기반프로그래밍',
    time: '15:00 - 16:00',
    location: '제6공학관(컴퓨터공학관)(201)-6409-1',
    professor: '이선열'
  },
  {
    id: '6',
    subject: '소프트웨어공학',
    time: '16:30 - 17:30',
    location: '제6공학관(컴퓨터공학관)(201)-6203',
    professor: '채흥석'
  },
  {
    id: '7',
    subject: '생활속의심리학',
    time: '18:00 - 19:00',
    location: '성학관(422)-101',
    professor: '서수균'
  },
  {
    id: '8',
    subject: '임베디드시스템설계및실험',
    time: '18:30 - 21:30',
    location: '제6공학관(컴퓨터공학관)(201)-6517',
    professor: '김원석'
  }
]

export const mockTransportInfo = [
  {
    id: '1',
    busNumber: '128',
    destination: '부산대학교',
    arrivalTime: 5,
    status: 'onTime' as const,
    recommendation: '지금 출발하면 딱 맞아요!'
  },
  {
    id: '2',
    busNumber: '77',
    destination: '부산대학교',
    arrivalTime: 12,
    status: 'delayed' as const,
    recommendation: '약간 여유있게 출발하세요'
  }
]

export const mockUserInfo = {
  name: '박준이',
  studentId: '202155556',
  major: '정보컴퓨터공학부',
  college: '정보의생명공학대학',
  semester: '2024-2학기',
  grade: '3학년'
}