export const mockSchedule = [
  // 월요일
  {
    id: '1',
    subject: '공학작문및발표',
    time: '10:30 - 12:00',
    location: '제6공학관 6409호',
    professor: '우균',
    day: 'monday'
  },
  {
    id: '2',
    subject: '이산수학(II)',
    time: '13:30 - 15:00',
    location: '제6공학관 6202호',
    professor: '손준영',
    day: 'monday'
  },
  {
    id: '3',
    subject: '일반물리학(II)',
    time: '15:00 - 16:30',
    location: '제6공학관 6516호',
    professor: '천미연',
    day: 'monday'
  },
  {
    id: '4',
    subject: '소프트웨어공학',
    time: '16:30 - 18:00',
    location: '제6공학관 6203호',
    professor: '채흥석',
    day: 'monday'
  },
  {
    id: '5',
    subject: '임베디드시스템설계및실험',
    time: '18:30 - 21:30',
    location: '제6공학관 6517호',
    professor: '김원석',
    day: 'monday'
  },
  // 화요일
  {
    id: '6',
    subject: '전기전자공학개론',
    time: '13:30 - 15:00',
    location: '제6공학관 6202호',
    professor: '김정구',
    day: 'tuesday'
  },
  {
    id: '7',
    subject: '플랫폼기반프로그래밍',
    time: '15:00 - 16:30',
    location: '제6공학관 6409-1호',
    professor: '이선열',
    day: 'tuesday'
  },
  // 수요일
  {
    id: '8',
    subject: '공학작문및발표',
    time: '10:30 - 12:00',
    location: '제6공학관 6409호',
    professor: '우균',
    day: 'wednesday'
  },
  {
    id: '9',
    subject: '이산수학(II)',
    time: '13:30 - 15:00',
    location: '제6공학관 6202호',
    professor: '손준영',
    day: 'wednesday'
  },
  {
    id: '10',
    subject: '일반물리학(II)',
    time: '15:00 - 16:30',
    location: '제6공학관 6516호',
    professor: '천미연',
    day: 'wednesday'
  },
  {
    id: '11',
    subject: '소프트웨어공학',
    time: '16:30 - 18:00',
    location: '제6공학관 6203호',
    professor: '채흥석',
    day: 'wednesday'
  },
  // 목요일
  {
    id: '12',
    subject: '전기전자공학개론',
    time: '13:30 - 15:00',
    location: '제6공학관 6202호',
    professor: '김정구',
    day: 'thursday'
  },
  {
    id: '13',
    subject: '플랫폼기반프로그래밍',
    time: '15:00 - 16:30',
    location: '제6공학관 6409-1호',
    professor: '이선열',
    day: 'thursday'
  },
  // 금요일
  {
    id: '14',
    subject: '생활속의심리학',
    time: '18:00 - 21:00',
    location: '성학관 101호',
    professor: '서수균',
    day: 'friday'
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
  semester: '2025-2학기',
  grade: '3학년'
}