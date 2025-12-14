import { useState } from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import dayjs from 'dayjs';

// Dark theme with proper text colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4aa',
    },
    background: {
      paper: '#1a2733',
      default: '#0f1923',
    },
    text: {
      primary: '#ffffff',
      secondary: '#7a8a99',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#1a2733',
            color: '#ffffff',
            '& fieldset': {
              borderColor: '#2a3a47',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#00d4aa',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00d4aa',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#7a8a99',
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#00d4aa',
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
            fontSize: '1rem',
          },
          '& .MuiSvgIcon-root': {
            color: '#7a8a99',
          },
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&.Mui-selected': {
            backgroundColor: '#00d4aa !important',
            color: '#0f1923',
            fontWeight: 700,
          },
          '&:hover': {
            backgroundColor: '#2a3a47',
          },
        },
      },
    },
    MuiClock: {
      styleOverrides: {
        pin: {
          backgroundColor: '#00d4aa',
        },
      },
    },
    MuiClockPointer: {
      styleOverrides: {
        root: {
          backgroundColor: '#00d4aa',
        },
        thumb: {
          backgroundColor: '#00d4aa',
          borderColor: '#00d4aa',
        },
      },
    },
    MuiClockNumber: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '&.Mui-selected': {
            backgroundColor: '#00d4aa',
            color: '#0f1923',
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {
          color: '#ffffff',
        },
      },
    },
    MuiPickersArrowSwitcher: {
      styleOverrides: {
        button: {
          color: '#ffffff',
        },
      },
    },
    MuiDayCalendar: {
      styleOverrides: {
        weekDayLabel: {
          color: '#7a8a99',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a2733',
          border: '2px solid #2a3a47',
        },
      },
    },
  },
});

export default function DateTimePicker({ onSubmit, onCancel }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());

  const handleSubmit = () => {
    const date = selectedDate.format('YYYY-MM-DD');
    const time = selectedTime.format('HH:mm');
    onSubmit(date, time);
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="space-y-4">
          {/* Date Picker */}
          <DatePicker
            label="Select Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            minDate={dayjs()}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
              },
            }}
          />

          {/* Mobile Time Picker */}
          <MobileTimePicker
            label="Select Time"
            value={selectedTime}
            onChange={(newValue) => setSelectedTime(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: 'outlined',
              },
            }}
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-[#2a3a47] hover:bg-[#3a4554] font-valorant text-sm tracking-wider text-white rounded transition-all"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-3 bg-[#00d4aa] hover:bg-[#00c29a] font-valorant text-sm tracking-wider text-[#0f1923] rounded transition-all shadow-lg shadow-[#00d4aa]/30"
            >
              ADD SLOT
            </button>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
