import { mockTransportInfo } from '../../shared/lib/mock-data'

export function TransportStatus() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          🚌 실시간 교통정보
        </h3>
        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full">
          실시간
        </span>
      </div>
      
      <div className="space-y-4">
        {mockTransportInfo.map((transport) => (
          <div
            key={transport.id}
            className={`p-4 rounded-xl border transition-all duration-200 ${
              transport.status === 'onTime'
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                : 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  transport.status === 'onTime' ? 'bg-green-500' : 'bg-amber-500'
                }`}>
                  {transport.busNumber}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {transport.destination}행
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {transport.status === 'onTime' ? '정시 운행' : '약간 지연'}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  transport.status === 'onTime' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {transport.arrivalTime}분
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  후 도착
                </div>
              </div>
            </div>
            
            <div className={`text-sm px-3 py-2 rounded-lg ${
              transport.status === 'onTime'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
            }`}>
              💡 {transport.recommendation}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          더 많은 노선 보기 →
        </button>
      </div>
    </div>
  )
}