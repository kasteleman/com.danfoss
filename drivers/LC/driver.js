"use strict";

const ZwaveDriver = require('homey-zwavedriver');
// http://www.pepper1.net/zwavedb/device/6

module.exports = new ZwaveDriver('LC', {
    debug: true, // set to true to view all incoming events
    capabilities: {
      'target_temperature': {
  			'command_class'				: 'COMMAND_CLASS_THERMOSTAT_SETPOINT',
        'command_get'    : 'THERMOSTAT_SETPOINT_GET',
        'command_get_parser'		: function(){
          console.log('Get');
          return  {
            'Level': {
                    'Setpoint Type': 'Heating 1' // (or 'Cooling 1', are more options but seem superfluous)
                }/*,
                'Level2': {
                    'Size': 0,
                    'Scale': 0,
                    'Precision': 0
                }*/
            //'Value': value
            }
          }
      },
      'measure_battery': {
  			'command_class'				: 'COMMAND_CLASS_BATTERY',
  			'command_report'    : 'BATTERY_REPORT',
        command_report_parser:  report => {
          console.log('REPORT');
          console.log(report);
          console.log(report['Battery Level (Raw)']);
          console.log(report['Battery Level (Raw)'][0]);
          return report['Battery Level (Raw)'][0];
        },
        'command_get'    : 'BATTERY_GET',
        command_report_parser:  report => {
          console.log('GET');
          console.log(report);
          console.log(report['Battery Level (Raw)']);
          console.log(report['Battery Level (Raw)'][0]);
          return report['Battery Level (Raw)'][0];
        }
      }
    },

		settings: {
		}
	})
