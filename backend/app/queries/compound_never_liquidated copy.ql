{
  account(id: "{{ address }}") {
    id
    hasBorrowed
    countLiquidated
    health
    totalBorrowValueInEth
    totalCollateralValueInEth
  }
}