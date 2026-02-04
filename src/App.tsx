import { useState, useMemo } from 'react';
import { FileUploader } from './components/FileUploader';
import { ChartControls } from './components/ChartControls';
import { BarChartView } from './components/BarChartView';
import { LineChartView } from './components/LineChartView';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import type { WorkoutEntry } from './types/workout';
import { parseExcelFile, readWorkbook } from './utils/parseExcel';
import { groupByDate, filterByExercise, truncateToSets } from './utils/dataTransform';
import { SheetSelector } from './components/SheetSelector';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { WorkoutTable } from './components/WorkoutTable';
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
      <Header />

      <main className="container py-12 flex-1">
        {!data.length ? (
          <Hero
            onFileSelect={handleFileSelect}
            isLoading={isLoading}
            error={error}
            onClear={clearData}
            fileName={fileName}
          />
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

            <WorkoutTable
              data={filteredData}
              onRowClick={setSelectedWorkoutForDetail}
            />
          </div>
        )}
      </main>

      <Footer />

      <WorkoutDetailModal
        workout={selectedWorkoutForDetail}
        onClose={() => setSelectedWorkoutForDetail(null)}
      />

      <LanguageSwitcher />
    </div>
  );
}

export default App;

