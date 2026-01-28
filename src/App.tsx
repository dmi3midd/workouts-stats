import { useState, useMemo } from 'react';
import { FileUploader } from './components/FileUploader';
import { ChartControls } from './components/ChartControls';
import { BarChartView } from './components/BarChartView';
import { LineChartView } from './components/LineChartView';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import type { WorkoutEntry } from './types/workout';
import { parseExcelFile, readWorkbook } from './utils/parseExcel';
import { groupByDate, filterByExercise, truncateToSets } from './utils/dataTransform';
import { Dumbbell, Info } from 'lucide-react';
import { SheetSelector } from './components/SheetSelector';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

function App() {
  const { t } = useTranslation();
  const [data, setData] = useState<WorkoutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'volume' | 'reps'>('volume');
  const [selectedWorkoutForDetail, setSelectedWorkoutForDetail] = useState<WorkoutEntry | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState<string | "__all__">("");
  const [selectedSetsCount, setSelectedSetsCount] = useState('all');

  const handleFileSelect = async (file: File) => {
    const MAX_SIZE = 6 * 1024 * 1024; // 6MB
    if (file.size > MAX_SIZE) {
      setError(t('uploader.error_size'));
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const wb = await readWorkbook(file);
      const names = wb.SheetNames;
      setWorkbook(wb);
      setSheetNames(names);
      setFileName(file.name);

      const defaultSheet = names[0];
      setSelectedSheet(defaultSheet);

      const parsedData = await parseExcelFile(wb, defaultSheet);
      setData(parsedData);

      const uniqueExercises = Array.from(new Set(parsedData.map(d => d.exercise)));
      if (uniqueExercises.length > 0) {
        setSelectedExercise(uniqueExercises[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSheetChange = async (sheetName: string | "__all__") => {
    if (!workbook) return;
    setIsLoading(true);
    try {
      setSelectedSheet(sheetName);
      const parsedData = await parseExcelFile(workbook, sheetName);
      setData(parsedData);

      const uniqueExercises = Array.from(new Set(parsedData.map(d => d.exercise)));
      if (uniqueExercises.length > 0 && !uniqueExercises.includes(selectedExercise)) {
        setSelectedExercise(uniqueExercises[0]);
      }
    } catch (err) {
      setError(t('uploader.error_parse'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearData = () => {
    setData([]);
    setWorkbook(null);
    setSheetNames([]);
    setSelectedSheet("");
    setFileName(null);
    setSelectedExercise('');
    setSelectedSetsCount('all');
  };

  const exercises = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.exercise)));
  }, [data]);

  const processedData = useMemo(() => {
    if (selectedSetsCount === 'all') return data;
    const count = parseInt(selectedSetsCount);
    return data.map(entry => truncateToSets(entry, count));
  }, [data, selectedSetsCount]);

  const filteredData = useMemo(() => {
    return filterByExercise(processedData, selectedExercise);
  }, [processedData, selectedExercise]);

  const analyticsData = useMemo(() => {
    return groupByDate(filteredData);
  }, [filteredData]);


  const barMetric = useMemo(() => {
    if (selectedMetric === 'volume') return 'totalVolume';
    if (selectedMetric === 'reps') return 'totalReps';
    return 'maxWeight';
  }, [selectedMetric]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-3xl sticky top-0 z-50 h-20 flex items-center">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(253,164,129,0.2)]">
              <Dumbbell className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{t('app.title')}</h1>
              <p className="text-[0.75rem] text-slate-400 font-medium uppercase tracking-widest">{t('app.subtitle')}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-12 flex-1">
        {!data.length ? (
          <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-6xl font-extrabold tracking-tight mb-4 text-white">
                {t('app.hero_title')}
              </h2>
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                {t('app.hero_subtitle')}
              </p>
            </div>
            <FileUploader
              onFileSelect={handleFileSelect}
              isLoading={isLoading}
              error={error}
              onClear={clearData}
              fileName={fileName}
            />
          </div>
        ) : (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between gap-6 mb-12 items-start md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{t('app.performance_title')}</h2>
                <p className="text-slate-400">{t('app.performance_subtitle')}</p>
              </div>
              <FileUploader
                onFileSelect={handleFileSelect}
                isLoading={isLoading}
                error={error}
                onClear={clearData}
                fileName={fileName}
              />
            </div>

            <SheetSelector
              sheetNames={sheetNames}
              selectedSheet={selectedSheet}
              onSheetChange={handleSheetChange}
            />

            <ChartControls
              exercises={exercises}
              selectedExercise={selectedExercise}
              onExerciseChange={setSelectedExercise}
              selectedMetric={selectedMetric}
              onMetricChange={setSelectedMetric}
              selectedSetsCount={selectedSetsCount}
              onSetsCountChange={setSelectedSetsCount}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BarChartView
                data={analyticsData}
                metric={barMetric as any}
                title={selectedMetric === 'volume' ? t('metrics.volume_dist') : selectedMetric === 'reps' ? t('metrics.reps_count') : t('metrics.avg_weight')}
              />
              <LineChartView
                data={filteredData}
                metric={selectedMetric}
                title={`${selectedExercise === 'All' ? t('controls.overall') : selectedExercise} ${t('controls.progress')}`}
              />
            </div>

            <section className="glass-card mt-12 overflow-hidden p-0">
              <div className="flex justify-between items-center px-6 pt-6 pb-4">
                <h3 className="text-lg font-semibold">{t('preview.title')}</h3>
                <div className="text-slate-500 text-xs flex items-center gap-1">
                  <Info size={14} /> {t('preview.tip')}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.date')}</th>
                      <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.exercise')}</th>
                      <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.sets')}</th>
                      <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.reps')}</th>
                      <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.weight')}</th>
                      <th className="text-left py-3 px-4 text-slate-400 text-xs uppercase tracking-wider border-b border-card-border">{t('preview.headers.volume')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 50).map((row, i) => (
                      <tr key={i}
                        onClick={() => setSelectedWorkoutForDetail(row)}
                        className="cursor-pointer hover:bg-white/2 transition-colors"
                      >
                        <td className="py-3 px-4 border-b border-white/5 text-sm">{row.date}</td>
                        <td className="py-3 px-4 border-b border-white/5 text-sm font-medium text-white">{row.exercise}</td>
                        <td className="py-3 px-4 border-b border-white/5 text-sm">{row.sets}</td>
                        <td className="py-3 px-4 border-b border-white/5 text-sm">{row.reps}</td>
                        <td className="py-3 px-4 border-b border-white/5 text-sm">{row.weight.toFixed(1)}</td>
                        <td className="py-3 px-4 border-b border-white/5 text-sm text-primary font-bold">{row.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="container py-12 mt-12 border-t border-white/5 text-center">
        <p className="text-sm text-slate-500 italic">{t('app.footer')}</p>
      </footer>

      <WorkoutDetailModal
        workout={selectedWorkoutForDetail}
        onClose={() => setSelectedWorkoutForDetail(null)}
      />

      <LanguageSwitcher />
    </div>
  );
}

export default App;
