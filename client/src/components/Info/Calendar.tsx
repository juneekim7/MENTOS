import { css } from "@emotion/react"
import React from "react"
import Calendar from "react-calendar"
import moment from "moment"
import "react-calendar/dist/Calendar.css"

const CalendarWrapper: React.FC<React.PropsWithChildren> = (props) => {
    return (
        <div
            css={css`
                width: 100%;
                display: flex;
                justify-content: center;
                position: relative;
                font-family: "Pretendard", sans-serif; 
                .react-calendar {
                    width: 100%;
                    border: none;
                    border-radius: 0.5rem;
                    box-shadow: 4px 2px 10px 0px rgba(0, 0, 0, 0.13);
                    padding: 3% 5%;
                    background-color: white;
                }

                button {
                    abbr {
                        font-family: "Pretendard", sans-serif;
                    }
                }
                
                .react-calendar__month-view__weekdays__weekday {
                    abbr {
                        font-family: "Pretendard", sans-serif;
                        text-decoration: none;
                        color: black;
                        font-size: 14px;
                    }
                }
                
                .react-calendar__century-view__decades__decade,
                .react-calendar__decade-view__years__year,
                .react-calendar__month-view__days__day,
                .react-calendar__month-view__days__day--weekend {
                    font-family: "Pretendard", sans-serif;
                    abbr {
                        font-family: "Pretendard", sans-serif;
                        color: black;
                    }
                }
                
                .react-calendar__tile {
                    border-radius: 6px;
                    abbr {     
                        font-size: 14px;
                    }
                }

                .react-calendar__tile--rangeStart,
                .react-calendar__tile--rangeEnd,
                .react-calendar__tile--rangeBothEnds {
                    background-color: var(--mentos-official) !important;
                    abbr {
                        color: white !important;
                    }

                    :hover {
                        background-color: var(--mentos-official-dark);
                    }
                }


                .react-calendar__tile--now {
                    background-color: white;
                    abbr {
                        color: var(--mentos-official);
                    }

                    :hover {
                        background-color: #e6e6e6;
                    }
                }

                .react-calendar__month-view__days__day--neighboringMonth {
                    abbr {
                        color: #A0A0A0;
                    }
                }

                .react-calendar__navigation__label {
                    flex-grow: 0;
                    span {
                        font-size: 16px;
                        font-weight: 500;
                        font-family: "Pretendard", sans-serif;
                    }
                }

                .react-calendar__navigation__label:disabled {
                    background-color: white;
                    color: black;
                }

                .react-calendar__navigation__arrow {
                    font-size: 20px;
                }

                .react-calendar__navigation__arrow {
                    min-width: 30px !important;
                    padding: 0 !important;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .react-calendar__navigation {
                    height: 32px !important;
                }
            `}
        >
            {props.children}
        </div>
    )
}

interface IModalCalendarProps {
    day: Date
    setDay: React.Dispatch<React.SetStateAction<Date>>
}

export const ModalCalendar: React.FC<IModalCalendarProps> = (props) => {
    return (
        <CalendarWrapper>
            <Calendar
                minDetail="month"
                maxDetail="month"
                formatDay={(_locale, date) => moment(date).format("D")}
                defaultValue={props.day}
                onClickDay={(value) => {
                    props.setDay(value)
                }}
                css={css`max-width: 350px;`}
            />
        </CalendarWrapper>
    )
}