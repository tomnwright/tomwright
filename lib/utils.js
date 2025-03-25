
export function seekDiscreteMax(increase, decrease, checkExceed) {
  // inputs three callbacks to increase/decrease the variable and check whether it exceeds the max

  // if start value > max, decrease until within bounds
  if (checkExceed()) {
    while (checkExceed()) {
      decrease();
    }
    return;
  }

  // if start value < max, increase until out of bounds
  while (!checkExceed()) {
    increase();
  }
  // then decrease once to set to the largest value within bounds
  decrease();
}
