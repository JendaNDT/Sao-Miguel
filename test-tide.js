fetch("https://marine-api.open-meteo.com/v1/marine?latitude=37.856&longitude=-25.850&hourly=wave_height,wave_period").then(r => r.text()).then(console.log)
