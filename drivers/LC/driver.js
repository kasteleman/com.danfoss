'use strict';

const path			= require('path');
const ZwaveDriver	= require('homey-zwavedriver');

module.exports = new ZwaveDriver(path.basename(__dirname), {
	debug: true,
    capabilities: {
      target_temperature: {
        command_class: 'COMMAND_CLASS_THERMOSTAT_SETPOINT',
        command_get: 'THERMOSTAT_SETPOINT_GET',
        command_get_parser: function () {
                return {
                    Level: {
                        'Setpoint Type': 'Heating 1',
                    },
                };
        },
        command_report: 'THERMOSTAT_SETPOINT_REPORT',
        command_report_parser: report => {
                if (report.hasOwnProperty('Level2')
                && report.Level2.hasOwnProperty('Scale')
                && report.Level2['Scale'] === 0) {
                    return report['Value (Parsed)'];
                } return null;
        },
      },

      measure_battery: {
  			command_class: 'COMMAND_CLASS_BATTERY',
        command_get: 'BATTERY_GET',
  			command_report: 'BATTERY_REPORT',
        command_report_parser:  report => {
          console.log('REPORT');
          console.log(report);
          console.log(report['Battery Level (Raw)']);
          console.log(report['Battery Level (Raw)'][0]);
          return report['Battery Level (Raw)'][0];
        }
      }
    },

		settings: {
		}
	});
