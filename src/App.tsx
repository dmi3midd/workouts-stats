import { useState, useMemo } from 'react';
import { FileUploader } from './components/FileUploader';
import { ChartControls } from './components/ChartControls';
import { BarChartView } from './components/BarChartView';
import { LineChartView } from './components/LineChartView';
import { WorkoutDetailModal } from './components/WorkoutDetailModal';
import type { WorkoutEntry } from './types/workout';
import { parseExcelFile, readWorkbook } from './utils/parseExcel';
import { groupByDate, filterByExercise } from './utils/dataTransform';
import { Dumbbell, Info } from 'lucide-react';
import { SheetSelector } from './components/SheetSelector';
import * as XLSX from 'xlsx';

function App() {
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

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const wb = await readWorkbook(file);
      const names = wb.SheetNames;
      setWorkbook(wb);
      setSheetNames(names);
      setFileName(file.name);

      // If multiple sheets, we don't parse immediately or we parse the first one
      const defaultSheet = names[0];
      setSelectedSheet(defaultSheet);

      const parsedData = await parseExcelFile(wb, defaultSheet);
      setData(parsedData);

      // Auto-select first exercise
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
      setError(err instanceof Error ? err.message : 'Failed to parse sheet');
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
  };

  const exercises = useMemo(() => {
    return Array.from(new Set(data.map((d) => d.exercise)));
  }, [data]);

  const filteredData = useMemo(() => {
    return filterByExercise(data, selectedExercise);
  }, [data, selectedExercise]);

  const analyticsData = useMemo(() => {
    return groupByDate(filteredData);
  }, [filteredData]);

  const barMetric = useMemo(() => {
    if (selectedMetric === 'volume') return 'totalVolume';
    if (selectedMetric === 'reps') return 'totalReps';
    return 'maxWeight';
  }, [selectedMetric]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '5rem',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              backgroundColor: 'var(--primary)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.2)'
            }}>
              <Dumbbell style={{ color: 'white' }} size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>WorkoutStats</h1>
              <p style={{ fontSize: '0.75rem', color: 'var(--slate-400)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analytics</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container" style={{ padding: '3rem 1.5rem', flex: 1 }}>
        {!data.length ? (
          <div className="animate-fade-in" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            maxWidth: '42rem',
            margin: '0 auto'
          }}>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{
                fontSize: '3.75rem',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                marginBottom: '1rem',
                color: 'white',
                fontStyle: 'normal'
              }}>
                Visualize Your Gains.
              </h2>
              <p style={{ fontSize: '1.25rem', color: 'var(--slate-400)', fontWeight: 300, lineHeight: 1.6 }}>
                Upload your training logs in Excel format and transform raw data into powerful insights. No servers, no sign-ups, just pure performance tracking.
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
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '1.5rem',
              marginBottom: '3rem'
            }} className="md-row">
              <style>{`
                @media (min-width: 768px) {
                  .md-row { flex-direction: row !important; align-items: center !important; }
                }
              `}</style>
              <div>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Training Performance</h2>
                <p style={{ color: 'var(--slate-400)' }}>Deep dive into your workout metrics and progress.</p>
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
            />

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem'
            }}>
              <BarChartView
                data={analyticsData}
                metric={barMetric as any}
                title={selectedMetric === 'volume' ? 'Volume Distribution' : selectedMetric === 'reps' ? 'Reps Count' : 'AVG Weight'}
              />
              <LineChartView
                data={filteredData}
                metric={selectedMetric}
                title={`${selectedExercise === 'All' ? 'Overall' : selectedExercise} Progress`}
              />
            </div>

            <section className="glass-card" style={{ marginTop: '3rem', overflow: 'hidden', padding: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 1.5rem 1rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Data Preview</h3>
                <div style={{ color: 'var(--slate-500)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Info size={14} /> Click on any row to view set details
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Exercise</th>
                      <th>Sets</th>
                      <th>Reps</th>
                      <th>Weight (kg)</th>
                      <th>Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 50).map((row, i) => (
                      <tr key={i}
                        onClick={() => setSelectedWorkoutForDetail(row)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td>{row.date}</td>
                        <td style={{ fontWeight: 500, color: 'white' }}>{row.exercise}</td>
                        <td>{row.sets}</td>
                        <td>{row.reps}</td>
                        <td>{row.weight.toFixed(1)}</td>
                        <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{row.volume}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="container" style={{ padding: '3rem 0', marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', fontStyle: 'italic' }}>Built for performance athletes. 100% Client-side. No trackers.</p>
      </footer>

      <WorkoutDetailModal
        workout={selectedWorkoutForDetail}
        onClose={() => setSelectedWorkoutForDetail(null)}
      />
    </div>
  );
}

export default App;
