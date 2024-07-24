import React, { useState, useEffect } from 'react';
import { Select, Card, CardHeader, CardContent, CardFooter, Button } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const SalaryCalculator = () => {
  const [role, setRole] = useState('');
  const [level, setLevel] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState(null);
  const [salaryHistory, setSalaryHistory] = useState([]);

  const sfBenchmarks = {
    ic_ttc: { compensation: 100000, percentage_variable: 0, from_base: true },
    manager_ttc: { compensation: 140000, percentage_variable: 0, from_base: true },
    director_ttc: { compensation: 180000, percentage_variable: 0.15, from_base: true },
    senior_director_ttc: { compensation: 220000, percentage_variable: 0.15, from_base: true }
  };

  const levelFactors = {
    Junior: 0.8,
    Intermediate: 1.0,
    Senior: 1.2,
    'Staff/Manager': 1.0,
    'Senior Manager': 1.2,
    Director: 1.0,
    'Senior Director': 1.0
  };

  const locationFactors = {
    'San Francisco': 1.0,
    'New York': 0.95,
    London: 0.85,
    Berlin: 0.75,
    Remote: 0.70
  };

  useEffect(() => {
    // Load salary history from local storage
    const savedHistory = localStorage.getItem('salaryHistory');
    if (savedHistory) {
      setSalaryHistory(JSON.parse(savedHistory));
    }
  }, []);

  const calculateSalary = () => {
    if (!role || !level || !location) {
      alert('Please select all fields');
      return;
    }

    const sfBenchmark = sfBenchmarks[role].compensation;
    const levelFactor = levelFactors[level];
    const locationFactor = locationFactors[location];

    const totalSalary = sfBenchmark * levelFactor * locationFactor;

    let baseSalary = totalSalary;
    let variableComp = 0;

    if (sfBenchmarks[role].percentage_variable > 0) {
      variableComp = totalSalary * sfBenchmarks[role].percentage_variable;
      baseSalary = totalSalary - variableComp;
    }

    const newResult = {
      baseSalary: baseSalary.toFixed(2),
      variableComp: variableComp.toFixed(2),
      totalSalary: totalSalary.toFixed(2)
    };

    setResult(newResult);

    // Update salary history
    const updatedHistory = [...salaryHistory, { ...newResult, date: new Date().toISOString() }];
    setSalaryHistory(updatedHistory);
    localStorage.setItem('salaryHistory', JSON.stringify(updatedHistory));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">GitLab-inspired Salary Calculator</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-1">Role</label>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              {Object.keys(sfBenchmarks).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block mb-1">Level</label>
            <Select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">Select Level</option>
              {Object.keys(levelFactors).map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block mb-1">Location</label>
            <Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">Select Location</option>
              {Object.keys(locationFactors).map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={calculateSalary} className="w-full">Calculate Salary</Button>
      </CardFooter>
      {result && (
        <CardContent>
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Calculated Salary:</h3>
            <p>Base Salary: ${result.baseSalary}</p>
            <p>Variable Compensation: ${result.variableComp}</p>
            <p className="font-bold">Total Salary: ${result.totalSalary}</p>
          </div>
        </CardContent>
      )}
      {salaryHistory.length > 0 && (
        <CardContent>
          <h3 className="text-lg font-semibold mb-2">Salary History</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalSalary" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      )}
      <CardContent>
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Disclaimer</AlertTitle>
          <AlertDescription>
            This calculator provides estimates based on simplified data and should not be considered as official GitLab compensation information. For accurate and up-to-date compensation details, please refer to GitLab's official resources.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default SalaryCalculator;