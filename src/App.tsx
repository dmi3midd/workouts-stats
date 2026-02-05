import { useMemo } from 'react';
import { FileUploader } from './components/FileUploader';
import { ChartControls } from './components/ChartControls';
import { BarChartView } from './components/BarChartView';
import { LineChartView } from './components/LineChartView';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import { filterByExercise, truncateToSets } from './utils/dataTransform';
import { groupByDate } from './utils/dataTransform';
import { SheetSelector } from './components/SheetSelector';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { WorkoutTable } from './components/WorkoutTable';
import { useTranslation } from 'react-i18next';
import { useWorkoutStore } from './store/useWorkoutStore';
import { useUIStore } from './store/useUIStore';

function App() {
  const { t } = useTranslation();

  const {
    data,
    selectedExercise,
    selectedMetric,
    selectedSetsCount,
    clearData,
    loadFile
  } = useWorkoutStore();

  const {
    isLoading, setIsLoading,
    error, setError,
    fileName, setFileName
  } = useUIStore();

  const handleFileSelect = (file: File) => {
    loadFile(file, t, () => setIsLoading(true), () => setIsLoading(false), setError, setFileName);
  };

  const filteredData = useMemo(() => {
    const processed = selectedSetsCount === 'all'
      ? data
      : data.map(entry => truncateToSets(entry, parseInt(selectedSetsCount)));
    return filterByExercise(processed, selectedExercise);
  }, [data, selectedExercise, selectedSetsCount]);

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
      <Header />

      <main className="container py-12 flex-1">
        {!data.length ? (
          <Hero />
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

            <SheetSelector />

            <ChartControls />

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

            <WorkoutTable />
          </div>
        )}
      </main>

      <Footer />

      <WorkoutDetailModal />

      <LanguageSwitcher />
    </div>
  );
}

export default App;

