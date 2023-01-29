<template>
    <div>
        <v-tabs>
            <v-tab @click="updateChart('day')">Dziennie</v-tab>
            <v-tab @click="updateChart('week')">Tygodniowo</v-tab>
            <v-tab @click="updateChart('month')">Miesięcznie</v-tab>
            <v-tab @click="updateChart('year')">Rocznie</v-tab>
        </v-tabs>
        <div>
            <canvas ref="costChart"></canvas>
        </div>
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs'
import axios from 'axios'

export default {
    extends: Bar,
    data() {
        return {
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: 'Koszty',
                        data: [],
                        backgroundColor: '#f87979'
                    }
                ]
            }
        }
    },
    mounted() {
        this.updateChart('day')
    },
    methods: {
        async updateChart(interval) {
            try {
                const response = await axios.get(`http://localhost:3001/costs?interval=${interval}`)
                console.log(response)
                this.chartData.labels = response.data.labels
                this.chartData.datasets[0].data = response.data.costs
                this.renderChart()
            } catch (error) {
                console.error(error)
            }
        },
    },
}
</script>