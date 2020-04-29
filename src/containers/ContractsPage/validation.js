import __ from "lodash";
import moment from "moment";
/**
 * Validation rentign debdor contract
 * @param {*} data Model of debobtor renting
 * Requied Fields: custormer, startDate, locationIdentier
 * 1 contract has at least 1 agreement
 *
 * ----------
 * Agreement
 * Requied Fields: type, description
 * has at least units when type accommodation
 * @returns {Object} {}
 *     isInvalid if inValid will return added {indexAggrement, indexCostLine}
 * ----------
 */
export const validationDebtorRentingContract = (data) => {
  let isInValid = false;
  let indexInvalidAggrement = -1;
  let indexInvalidCostLine = -1;
  // Validation general data
  const {
    noticeDays,
    customer,
    invoiceContact,
    locationIdentifier,
    startDate,
    agreementLines,
  } = data;
  if (
    !customer ||
    !noticeDays ||
    !invoiceContact ||
    !locationIdentifier ||
    !startDate ||
    !moment(startDate).isValid() ||
    __.isEmpty(agreementLines)
  ) {
    return {
      isInValid: true,
      indexAggrement: indexInvalidAggrement,
      indexCostLine: indexInvalidCostLine,
    };
  }
  // Validation agreement lines
  __.forEach(agreementLines, (agreement, indexAggrement) => {
    const { type, description, costLineGenerals, units } = agreement;
    if (!type || !description) {
      isInValid = true;
      indexInvalidAggrement = indexAggrement;
      return;
    }
    if (type && type === "Accommodation") {
      if (__.isEmpty(units)) {
        isInValid = true;
        indexInvalidAggrement = indexAggrement;
        return;
      }
    }
    // Validation cost lines
    if (!__.isEmpty(costLineGenerals)) {
      let indexInValid = __.findIndex(costLineGenerals, (costLine) => {
        // startDate same invoiceDate type Period maybe skip
        const { type, amount, costType, invoiceDate, description } = costLine;
        return (
          !type ||
          !amount ||
          !costType ||
          !description ||
          !invoiceDate ||
          !moment(invoiceDate).isValid()
        );
      });
      if (indexInValid > -1) {
        isInValid = true;
        indexInvalidCostLine = indexInValid;
        return;
      }
    }
  });
  return {
    isInValid: isInValid,
    indexAggrement: indexInvalidAggrement,
    indexCostLine: indexInvalidCostLine,
  };
};
/**
 * type Accommodation
 * duplicatedUnits true/false
 * sameCostLine true/false
 * @param {array} agreementLines
 */
export const validationAgreementLines = (agreementLines = []) => {
  let isInValid = false;
  if (__.isEmpty(agreementLines)) return { isInValid: false, agreementLines };
  __.forEach(agreementLines, (agreement, indexAggrement) => {
    const { type, units, costLineGenerals } = agreement;
    //TODO validation same units another agreement
    if (type === "Accommodation" && !__.isEmpty(units)) {
      let agreementLinesWillCompare = [...agreementLines];
      __.pullAt(agreementLinesWillCompare, [indexAggrement]);
      agreementLinesWillCompare = __.filter(
        agreementLinesWillCompare,
        (item) => item.type === "Accommodation",
      );
      const unitsWillCompare = __.reduce(
        agreementLinesWillCompare,
        (acc, item) => {
          acc = [...acc, ...__.map(item.units, (unit) => unit.id)];
          return acc;
        },
        [],
      );

      const existedUnit = __.find(units, (item) =>
        __.includes(unitsWillCompare, item.id),
      );
      if (existedUnit) {
        agreementLines[indexAggrement]["duplicatedUnits"] = true;
        isInValid = true;
      } else {
        agreementLines[indexAggrement]["duplicatedUnits"] = false;
      }
    }
    //TODO Validation costline samve all filed
    const {
      costLineGenerals: _costLineGenerals,
      isInValid: sameCostLine,
    } = checkSameGenearalCostLine(costLineGenerals);
    if (sameCostLine) {
      agreementLines[indexAggrement]["sameCostLine"] = true;
      agreementLines[indexAggrement]["costLineGenerals"] = _costLineGenerals;
      isInValid = true;
    } else {
      agreementLines[indexAggrement]["sameCostLine"] = false;
    }
  });
  console.log("agreementLines end: ", agreementLines);

  return { agreementLines, isInValid };
};

export const checkSameGenearalCostLine = (costLineGenerals) => {
  let isInValid = false;
  if (__.isEmpty(costLineGenerals))
    return { isInValid: false, costLineGenerals };
  console.log("start validation costline: ", __.isEmpty(costLineGenerals));

  __.forEach(costLineGenerals, (costLine, indexCostLine) => {
    const {
      type,
      description,
      invoiceDate,
      endDate,
      amount,
      period,
      costType,
    } = costLine;
    let costLinesWillCompare = [...costLineGenerals];
    __.pullAt(costLinesWillCompare, [indexCostLine]);

    costLinesWillCompare = __.filter(
      costLinesWillCompare,
      (item) => item.type === type,
    );

    console.log("costLinesWillCompare: ", costLinesWillCompare);
    const sameCostline = __.find(costLinesWillCompare, (item) => {
      let sameInvoiceDate = false;
      if (invoiceDate && moment(invoiceDate).isValid()) {
        if (
          item.invoiceDate &&
          moment(item.invoiceDate).isValid() &&
          moment(invoiceDate).format("ddMMyyyy").toString() ===
            moment(item.invoiceDate).format("ddMMyyyy").toString()
        ) {
          sameInvoiceDate = true;
        }
      } else if (!item.invoiceDate) {
        sameInvoiceDate = true;
      }
      //Special case
      let isSamePeirod = false;
      if (type === "Periodic" && item.type === type && period === item.period) {
        isSamePeirod = true;
      } else if (type !== "Periodic") {
        isSamePeirod = true;
      }
      //Special type Periodic validation same endDate
      let sameEndDate = false;
      if (type === "Periodic" && item.type === type) {
        if (endDate && moment(endDate).isValid()) {
          if (
            item.endDate &&
            moment(item.endDate).isValid() &&
            moment(endDate).format("ddMMyyyy").toString() ===
              moment(item.endDate).format("ddMMyyyy").toString()
          ) {
            sameEndDate = true;
          }
        } else if (!item.endDate) {
          sameEndDate = true;
        }
      } else {
        sameEndDate = true;
      }
      console.log(
        "Validation costline: ",
        item.type === type &&
          item.description === description &&
          item.amount === amount &&
          item.costType === costType &&
          isSamePeirod &&
          sameInvoiceDate &&
          sameEndDate,
      );

      return (
        item.type === type &&
        item.description === description &&
        item.amount === amount &&
        item.costType === costType &&
        isSamePeirod &&
        sameInvoiceDate &&
        sameEndDate
      );
    });

    if (sameCostline) {
      costLineGenerals[indexCostLine]["sameCostLine"] = true;
      isInValid = true;
    } else {
      costLineGenerals[indexCostLine]["sameCostLine"] = false;
    }
  });
  console.log("end validation costline: ", costLineGenerals, isInValid);
  return { costLineGenerals, isInValid };
};

/**
 * Check startDate & endDate on Change to allow override costline
 * @param {Date} dateContract startDate/endDate
 * @returns {Boolean} isAllowOverride
 */
export const overrideDateContract = {
  showOverrideStartDate(value, agreementLines) {
    let isShowOverride = false;
    __.forEach(agreementLines, (agreement) => {
      const { costLineGenerals } = agreement;
      const indexDateInvalid = __.findIndex(
        costLineGenerals,
        (costLine, indexCostLine) => {
          const { invoiceDate } = costLine;

          // Don't allow override when startDate costline > startDate Contract
          if (
            invoiceDate &&
            moment(invoiceDate).isValid() &&
            moment(moment(value).toISOString()).endOf("date").valueOf() >
              moment(moment(invoiceDate).toISOString()).endOf("date").valueOf()
          ) {
            return true;
          }
          return false;
        },
      );

      if (indexDateInvalid > -1) {
        isShowOverride = true;
        return;
      }
    });
    return isShowOverride;
  },
  showOverrideEndDate(value, agreementLines) {
    let isShowOverride = false;
    __.forEach(agreementLines, (agreement) => {
      const { costLineGenerals } = agreement;
      const indexDateInvalid = __.findIndex(costLineGenerals, (costLine) => {
        const { type, endDate } = costLine;
        // Don't allow override when endDate costline > endDate Contract type  Periodic
        if (
          type === "Periodic" &&
          endDate &&
          moment(endDate).isValid() &&
          moment(moment(value).toISOString()).endOf("date").valueOf() <
            moment(moment(endDate).toISOString()).endOf("date").valueOf()
        ) {
          return true;
        }
        return false;
      });
      if (indexDateInvalid > -1) {
        isShowOverride = true;
        return;
      }
    });
    return isShowOverride;
  },
  overrideStartDate(value, agreementLines) {
    let _agreementLines = [...agreementLines];
    __.forEach(_agreementLines, (agreement) => {
      const { costLineGenerals } = agreement;
      __.forEach(costLineGenerals, (costLine) => {
        const { type, invoiceDate, endDate } = costLine;
        if (
          invoiceDate &&
          moment(invoiceDate).isValid() &&
          moment(moment(value).toISOString()).endOf("date").valueOf() >
            moment(moment(invoiceDate).toISOString()).endOf("date").valueOf()
        ) {
          costLine["startDate"] = value;
          costLine["invoiceDate"] = value;
        }

        // Will remove endDate costline >= startDate costline
        if (
          type === "Periodic" &&
          endDate &&
          moment(endDate).isValid() &&
          moment(moment(endDate).toISOString()).endOf("date").valueOf() <=
            moment(moment(value).toISOString()).endOf("date").valueOf()
        ) {
          costLine["endDate"] = null;
        }
      });
    });
    return _agreementLines;
  },
  overrideEndDate(value, agreementLines) {
    let _agreementLines = [...agreementLines];
    __.forEach(_agreementLines, (agreement) => {
      const { costLineGenerals } = agreement;
      __.forEach(costLineGenerals, (costLine) => {
        const { type, endDate } = costLine;
        if (
          type === "Periodic" &&
          endDate &&
          moment(endDate).isValid() &&
          moment(moment(value).toISOString()).endOf("date").valueOf() <
            moment(moment(endDate).toISOString()).endOf("date").valueOf()
        ) {
          costLine["endDate"] = value;
        }
      });
    });
    return _agreementLines;
  },
};
