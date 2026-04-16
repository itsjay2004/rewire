# Dashboard & Analytics

## 1. Feature Overview
Visualizing progress. Shows the streak graph, urge frequency trends, and relapse triggers over time. Reinforces positive behavior via data.

## 2. UX Flow
1. User navigates to the "Insights" / "Analytics" tab.
2. **Top**: Weekly summary (Urges resisted, Check-ins done, Relapses).
3. **Chart 1**: Urge Intensity vs Time (Graphing the data from 5-hour check-ins over a week).
4. **Chart 2**: Relapse Triggers Breakdown (Pie Chart or Bar Chart - What triggers them most?).
5. **Pattern Text**: "Risk time prediction". Example: "You are most likely to relapse between 10 PM and 1 AM." (Derived from Relapse DB timestamps).

## 3. UI Components Needed
- **`VictoryChart`, `VictoryBar`, `VictoryPie`** from `victory-native`.
- **`SummaryCard`**: Grid of small stat blocks.
- **`InsightCard`**: Emphasized text block for pattern predictions.

## 4. Data Required (SQLite Queries)
- `SELECT COUNT(*) FROM CheckIns WHERE urge_intensity > 3 AND timestamp >= :week_start`
- `SELECT trigger, COUNT(*) as count FROM Relapses GROUP BY trigger ORDER BY count DESC`
- Time bucket aggregation `CAST(strftime('%H', timestamp) as INT)` to find common hours for relapses.

## 5. State Management
- Compute queries via custom React hooks (`useAnalytics(timeRange)`) and `useFocusEffect` to refetch from DB so data is completely fresh.

## 6. Implementation Steps
1. Install `victory-native` charting library.
2. Create analytics SQL queries and expose them via repository patterns in `db/index.ts`.
3. Build the Insights view layout, embedding charts inside responsive SVG containers.
4. Add the risk text logic to compute the mode (most common bucket) of relapse times.
