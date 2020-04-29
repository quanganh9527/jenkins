import React from "react";
import { find } from "lodash";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
/**
 * Display breadcrumbs units of location 
 * @location Location data
 * @unit Unit selected
 */
function UnitBreadcrumb({ location, unit }) {
  
  const _unitBreadcrumb = (unit) => {
    const isActive = unit ? !!unit.parent : false;
    return (
      <>
        {unit && unit.parent
          ? _unitBreadcrumb(
              find(location.units, (item) => item.id === unit.parent),
            )
          : null}
        {unit ? (
          <BreadcrumbItem active={isActive}>{unit.name}</BreadcrumbItem>
        ) : null}
      </>
    );
  };
  return <Breadcrumb>{_unitBreadcrumb(unit)}</Breadcrumb>;
}

export default UnitBreadcrumb;
