'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.vesternet.com/downloads/dl/file/id/196/product/1128/z_wave_danfoss_lc_13_living_connect_radiator_thermostat_manual.pdf

module.exports = new ZwaveDriver(path.basename(__dirname), {
	debug: true,
	capabilities: {
		measure_battery: {
			command_class: 'COMMAND_CLASS_BATTERY',
			command_get: 'BATTERY_GET',
			command_report: 'BATTERY_REPORT',
			command_report_parser: report => {
				if (report['Battery Level'] === "battery low warning") return 1;

				return report['Battery Level (Raw)'][0];
			}
		},

		target_temperature: {
			command_class: 'COMMAND_CLASS_THERMOSTAT_SETPOINT',
			command_get: 'THERMOSTAT_SETPOINT_GET',
			command_get_parser: function () {
				return {
					'Level': {
						'Setpoint Type': 'Heating 1',
					},
				};
			},
			command_set: 'THERMOSTAT_SETPOINT_SET',
			command_set_parser: value => {
				// make temperature a whole number
				let temp = Math.round(value*10);

				// create 2 byte buffer of the value
				const tempByte1 = Math.floor(temp/255);
				const tempByte2 = Math.round(temp-(255*tempByte1));
				temp = new Buffer([tempByte1, tempByte2]);

				return {
					'Level': new Buffer([1]), // Reserved = 0 (bits: 000), Setpoint Type = 1 (Heating)(bits: 00001)
					'Level2': new Buffer([34]), // Precision = 1 (bits: 001), Scale = 0 (bits: 00), Size = 2 (bits: 010)
					'Value': temp,
				};
			},
			command_report: 'THERMOSTAT_SETPOINT_REPORT',
			command_report_parser: report => {
			//console.log(report);
				if (report.hasOwnProperty('Level2') &&
					report.Level2.hasOwnProperty('Precision') &&
					report.Level2.hasOwnProperty('Size')) {
						const scale = Math.pow(10, report.Level2['Precision']);
						return report['Value'].readUIntBE(0, report.Level2['Size']) / scale;
						//console.log(report['Value'].readUIntBE(0, report.Level2['Size']) / scale);
					}
			}
		}
	}
});
