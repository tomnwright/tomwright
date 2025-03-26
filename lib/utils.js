export function seekDiscreteMax(
  increase,
  decrease,
  checkExceed,
  max_iters = undefined,
  errorCheck = undefined
) {
  // inputs three callbacks to increase/decrease the variable and check whether it exceeds the max

  let iters = 1;

  const check_iters = () => {
    if (max_iters && iters++ > max_iters)
      throw new Error("Max iters exceeded while seeking discrete max.");
  };
  const check_err = () => {
    if (errorCheck && errorCheck())
      throw new Error("Error state triggered while seeking discrete max.");
  };

  // if start value > max, decrease until within bounds
  if (checkExceed()) {
    while (checkExceed()) {
      check_iters();
      decrease();
      check_err();
    }
    return;
  }

  // if start value < max, increase until out of bounds
  while (!checkExceed()) {
    check_iters();
    increase();
    check_err();
  }
  // then decrease once to set to the largest value within bounds
  decrease();
}
