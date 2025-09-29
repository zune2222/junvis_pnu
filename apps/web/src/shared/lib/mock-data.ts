export const mockSchedule = [
  {
    id: '1',
    subject: '컴퓨터 과학개론',
    time: '09:00 - 10:30',
    location: '정보컴퓨터관 318호',
    professor: '김교수',
    status: 'upcoming' as const
  },
  {
    id: '2', 
    subject: '자료구조론',
    time: '11:00 - 12:30',
    location: '정보컴퓨터관 201호',
    professor: '이교수',
    status: 'scheduled' as const
  },
  {
    id: '3',
    subject: '알고리즘 설계',
    time: '14:00 - 15:30', 
    location: '공학관 B동 105호',
    professor: '박교수',
    status: 'scheduled' as const
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
  name: '준비스 학생',
  studentId: '2024123456',
  major: '컴퓨터공학과',
  semester: '2024-2학기'
}