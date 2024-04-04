
let processes = [];

        function addProcess() {
            let arrivalTime = parseInt(document.getElementById('arrivalTime').value);
            let burstTime = parseInt(document.getElementById('burstTime').value);
            processes.push({ id: processes.length + 1, arrivalTime: arrivalTime, burstTime: burstTime });
            document.getElementById('arrivalTime').value = '';
            document.getElementById('burstTime').value = '';
            updateTable();
        }

        function updateTable() {
            let table = document.getElementById('processTable');
            table.innerHTML = '';
            let headerRow = table.insertRow(0);
            headerRow.innerHTML = '<th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th>';
        
            for (let i = 0; i < processes.length; i++) {
                let row = table.insertRow(-1);
                row.innerHTML = '<td>' + processes[i].id + '</td><td>' + processes[i].arrivalTime + '</td><td>' + processes[i].burstTime + '</td><td></td><td></td><td></td>';
            }
        }
        

        function calculate() {
            let quantum = parseInt(document.getElementById('quantum').value);
            let n = processes.length;
            let remainingBurstTime = new Array(n);
            let waitingTime = new Array(n).fill(0);
            let turnaroundTime = new Array(n).fill(0);
            let completionTime = new Array(n).fill(0);
            let currentTime = 0;
            let index = 0;
            let ganttChart = [];
        
            // Copy burst times to remainingBurstTime
            for (let i = 0; i < n; i++) {
                remainingBurstTime[i] = processes[i].burstTime;
            }
        
            // Simulate Round Robin scheduling
            while (true) {
                let done = true;
        
                for (let i = 0; i < n; i++) {
                    if (remainingBurstTime[i] > 0) {
                        done = false;
        
                        if (remainingBurstTime[i] > quantum) {
                            currentTime += quantum;
                            remainingBurstTime[i] -= quantum;
                            ganttChart.push({ process: processes[i].id, startTime: currentTime - quantum, endTime: currentTime });
                        } else {
                            currentTime += remainingBurstTime[i];
                            waitingTime[i] += currentTime - processes[i].burstTime - processes[i].arrivalTime;
                            remainingBurstTime[i] = 0;
                            completionTime[i] = currentTime;
                            ganttChart.push({ process: processes[i].id, startTime: currentTime - remainingBurstTime[i], endTime: currentTime });
                        }
                    }
                }
        
                if (done === true) {
                    break;
                }
            }
        
            // Calculate turnaround time
            for (let i = 0; i < n; i++) {
                turnaroundTime[i] = completionTime[i] - processes[i].arrivalTime;
            }
        
            // Update table with results
            let table = document.getElementById('processTable');
            for (let i = 0; i < n; i++) {
                table.rows[i + 1].cells[3].innerHTML = completionTime[i];
                table.rows[i + 1].cells[4].innerHTML = turnaroundTime[i];
                table.rows[i + 1].cells[5].innerHTML = waitingTime[i];
            }
        
            // Generate Gantt chart
            generateGanttChart(ganttChart);
        }
        
        function generateGanttChart(ganttData) {
            let chartContainer = document.getElementById('chart-container');
            let canvas = document.getElementById('Chart');
            let ctx = canvas.getContext('2d');
            let colors = ['#023e8a', '#0077b6', '#0096c7', '#00b4d8', '#48cae4','#90e0ef'];
            let processes = Array.from(new Set(ganttData.map(item => item.process)));
        
            canvas.width = 800;
            canvas.height = 100;
        
            let barHeight = 50;
            let padding = 10;
            let barWidth = (canvas.width - 2 * padding) / ganttData.length;
        
            for (let i = 0; i < ganttData.length; i++) {
                let data = ganttData[i];
                let color = colors[processes.indexOf(data.process) % colors.length];
                ctx.fillStyle = color;
                ctx.fillRect(padding + i * barWidth, padding, barWidth, barHeight);
                ctx.fillStyle = '#fff';
                ctx.fillText('P' + data.process, padding + i * barWidth + 5, padding + barHeight / 2 + 5);
            }
        
            // Add CSS styles for the Gantt chart
            canvas.style.border = '1px solid #007bff';
            canvas.style.borderRadius = '5px';
        }
        
        
