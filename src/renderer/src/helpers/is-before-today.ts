import moment from "moment";
import React from "react";

function isBeforeToday(date: string) {
  return moment(date).isBefore(moment().format("YYYY-MM-DD"));
}

export default isBeforeToday;
