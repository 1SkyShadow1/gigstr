import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfWeek, addWeeks, isSameWeek, parseISO } from "date-fns";

const Analytics = () => {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [charts, setCharts] = useState<{ Bar: any; Pie: any } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [timeRes, invoiceRes] = await Promise.all([
      supabase.from("time_entries").select("*").eq("user_id", user.id),
      supabase.from("invoices").select("*").eq("user_id", user.id),
    ]);
    setTimeEntries(timeRes.data || []);
    setInvoices(invoiceRes.data || []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    const loadCharts = async () => {
      const chartJs = await import("chart.js/auto");
      const reactCharts = await import("react-chartjs-2");
      void chartJs; // chart.js/auto self-registers needed elements
      setCharts({ Bar: reactCharts.Bar, Pie: reactCharts.Pie });
    };
    loadCharts();
  }, []);

  const totalSeconds = timeEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(2);
  const totalEarnings = invoices.reduce((sum, inv) => sum + (parseFloat(inv.amount) || 0), 0).toFixed(2);

  const now = new Date();
  const weeks = Array.from({ length: 8 }, (_, i) => startOfWeek(addWeeks(now, -7 + i)));
  const weekLabels = weeks.map(date => format(date, "MMM d"));
  const hoursPerWeek = weeks.map(weekStart => {
    const weekEntries = timeEntries.filter(entry => {
      const entryDate = parseISO(entry.start_time);
      return isSameWeek(entryDate, weekStart, { weekStartsOn: 1 });
    });
    const weekSeconds = weekEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0);
    return (weekSeconds / 3600).toFixed(2);
  });

  const projectMap: Record<string, number> = {};
  timeEntries.forEach(entry => {
    if (!entry.project) return;
    projectMap[entry.project] = (projectMap[entry.project] || 0) + (entry.duration || 0);
  });
  const projectLabels = Object.keys(projectMap);
  const projectData = Object.values(projectMap).map(sec => (sec / 3600).toFixed(2));

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Analytics Dashboard"
        description="View insights about your work hours, earnings, and productivity."
      />
      {loading ? (
        <div className="flex justify-center my-12 text-muted-foreground">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Total Hours Tracked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{totalHours} hrs</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">R {totalEarnings}</div>
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Hours Tracked Per Week</CardTitle>
            </CardHeader>
            <CardContent>
              {!charts ? (
                <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Loading charts...</div>
              ) : (
                <charts.Bar
                  data={{
                    labels: weekLabels,
                    datasets: [
                      {
                        label: "Hours",
                        data: hoursPerWeek,
                        backgroundColor: "rgba(124, 58, 237, 0.7)",
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      y: { beginAtZero: true },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Time Allocation by Project</CardTitle>
            </CardHeader>
            <CardContent>
              {!charts ? (
                <div className="h-64 flex items-center justify-center text-sm text-muted-foreground">Loading charts...</div>
              ) : (
                <charts.Pie
                  data={{
                    labels: projectLabels,
                    datasets: [
                      {
                        data: projectData,
                        backgroundColor: [
                          "rgba(124, 58, 237, 0.7)",
                          "rgba(52, 211, 153, 0.7)",
                          "rgba(59, 130, 246, 0.7)",
                          "rgba(251, 191, 36, 0.7)",
                          "rgba(239, 68, 68, 0.7)",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Analytics;
