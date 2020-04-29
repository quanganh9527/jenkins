/**
 *
 * Locations edit
 *
 */
import React, {
  Fragment,
  useState,
  useEffect,
  memo,
  useRef,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import Tabs, { TabPane } from "rc-tabs";
import { find, map, forEach, filter } from "lodash";
import TabContent from "rc-tabs/lib/SwipeableTabContent";
import ScrollableInkTabBar from "rc-tabs/lib/ScrollableInkTabBar";

import PageLayout from "../../../components/PageLayout";
import PageTitle from "../../../components/PageTitle";

import GeneralTab from "./GeneralTab";
import UnitsAndSubUnitsTab from "./UnitsAndSubUnitsTab";
import { Alert } from "reactstrap";
import useForm from "react-hook-form";
// import { validationLocation } from "./validation";
import { useSelector, useDispatch } from "react-redux";
import { locationActions } from "../actions";
import { loadingProviderActions } from "../../LoadingProvider/actions";

import { FormattedMessage, injectIntl } from "react-intl";
import Utils from "../../../utilities/utils";
import ModalGenerateCostCenter from "./ModalGenerateCostCenter";
function LocationEdit({ intl }) {

  const { orderByPosition } = Utils;
  // get default data inspection contact, region, country
  // init dispatch
  const childRef = useRef();
  const dispatch = useDispatch();
  let { locationId } = useParams();
  useEffect(() => {
    dispatch(locationActions.getInitData());
  }, [dispatch]);
  useEffect(() => {
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    dispatch(locationActions.getLocation(locationId));
  }, [dispatch, locationId]);
  // get state of store
  const locationState = useSelector((state) => state.location);
  const loadingStateProvider = useSelector((state) => state.loadingProvider);
  const {
    persons,
    groupings,
    countries,
    location,
    costCenters,
    notification,
  } = locationState;
  forEach(persons, (item) => {
    item.name = `${item.lastName} ${item.firstName}`;
    item.type = "person";
  });
  forEach(groupings, (item) => {
    item.type = "grouping";
  });

  // State
  const [isLoadingApp, setLoadingAppData] = useState(true);
  const [isSetData, setLoadingDataLocationEdit] = useState(false);
  const [locationIdSelected, setLocationIdSelected] = useState("");

  const [isActive, setStatusActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationContacts, setLocationContacts] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [units, setUnits] = useState([]);
  const [activeKeyTab, setActiveKeyTab] = useState("1");
  const [isSumitedInvalid, setIsSumitedInvalid] = useState(false);
  const [isOpenGenerateCostCenter, setOpenGenerateCostCenter] = useState(false);
  const [isAllowGenerateCostCenter, setIsGenerateCostCenter] = useState(false);
  // form validation
  const {
    // handleSubmit,
    register,
    errors,
    setValue,
    getValues,
    reset,
    triggerValidation,
    watch,
    formState,
    clearError,
    setError,
    unregister,
  } = useForm({
    // validationSchema: validationLocation(),
  });
  // custom validation
  register({ name: "active" });
  register(
    { name: "countrySelect" },
    {
      required: intl.formatMessage({
        id: "components.errors.address.country.require",
      }),
    },
  );
  register({ name: "country" });

  register(
    { name: "regionSelect" },
    {
      required: intl.formatMessage({
        id: "components.errors.address.region.require",
      }),
    },
  );
  register({ name: "region" });

  register(
    { name: "street" },
    {
      required: intl.formatMessage({
        id: "components.errors.address.street.require",
      }),
    },
  );
  register(
    { name: "number" },
    {
      required: intl.formatMessage({
        id: "components.errors.address.number.require",
      }),
    },
  );

  register(
    { name: "city" },
    {
      required: intl.formatMessage({
        id: "components.errors.address.city.require",
      }),
    },
  );
  // register(
  //   { name: "costcenterSelect" },
  //   {
  //     required: intl.formatMessage({
  //       id: "components.errors.costCenter.require",
  //     }),
  //   },
  // );
  register({ name: "costcenter" });

  const setInitAppData = () => {
    setLocationContacts([]);
    setUnits([]);
    reset({
      active: true,
      street: "",
      number: "",
      suffix: "",
      postalCode: "",
      city: "",
      region: "",
      regionSelect: "",
      country: "",
      countrySelect: "",
      costcenter: "",
      costcenterSelect: "",
    });
    setLocationIdSelected("");
    setStatusActive(true);
    setDescriptions([]);
    if (childRef.current) {
      childRef.current.handleResetFormData({});
    }
  };
  // useEffect(() => {
  //   setInitAppData();
  // })
  // reset form if state change router
  useEffect(() => {
    // reset when location change
    if (!locationId && location && location._id) {
      dispatch(locationActions.resetLocation());
      setInitAppData();
    }
  });
  useEffect(() => {
    if (!isSetData && location && location._id) {
      setLocationIdSelected(location._id);
      setStatusActive(location.active);
      setDescriptions(location.descriptions || []);
      setLoadingDataLocationEdit(true);
      setUnits(
        map(location.units, (item) => {
          return {
            id: item._id,
            _id: item._id,
            name: item.name,
            maxOccupants: item.maxOccupants || 0,
            parent: item.parent,
            count: item.count || 0,
            status: item.status || false,
            position: item.position,
          };
        }),
      );
      // set data update form
      reset({
        active: location.active || false,
        street: location.street || "",
        number: location.number || "",
        suffix: location.suffix || "",
        postalCode: location.postalCode || "",
        city: location.city || "",
        region: location.region ? location.region._id : "",
        regionSelect: location.region ? location.region._id : "",
        country: location.country ? location.country._id : "",
        countrySelect: location.country ? location.country._id : "",
        costcenter: location.costcenter ? location.costcenter._id : "",
        costcenterSelect: location.costcenter ? location.costcenter._id : "",
      });
      if (childRef.current) {
        childRef.current.handleResetFormData(location);
      }
    }
    if (isLoadingApp && location && location._id && groupings && persons) {
      setLoadingAppData(false);
      let defaultContactsLocation = map(location.locationContacts, (item) => {
        if (item.grouping) {
          let itemGroupResult = find(
            groupings,
            (itemGroup) => itemGroup._id === item.grouping,
          );
          if (itemGroupResult) {
            itemGroupResult.id = item.id;
            return Object.assign(itemGroupResult, {
              description: item.description || "",
            });
          }
        } else if (item.person) {
          let itemPersonResult = find(
            persons,
            (itemPerson) => itemPerson._id === item.person,
          );
          if (itemPersonResult) {
            itemPersonResult.id = item.id;
            return Object.assign(itemPersonResult, {
              description: item.description || "",
            });
          }
        }
      });
      defaultContactsLocation = filter(
        defaultContactsLocation,
        (item) => item && item._id,
      );
      setLocationContacts(defaultContactsLocation || []);
    }
  }, [location, groupings, persons, isLoadingApp, isSetData, reset]);

  // Watch change for generate costcenter open modal
  useEffect(() => {
    if (isAllowGenerateCostCenter) {
      clearError("costcenterSelect");
      unregister("costcenterSelect");
    } else {
      register(
        { name: "costcenterSelect" },
        {
          required: intl.formatMessage({
            id: "components.errors.costCenter.require",
          }),
        },
      );
    }
  }, [isAllowGenerateCostCenter]);

  // Watch error fileds to dissplay message
  const watchAllFields = watch();

  

  const createTreeUnits = (dataUnits) => {
    dataUnits = orderByPosition(dataUnits);
    let trees = map(
      filter(dataUnits, (item) => !item.parent),
      (unitItem, unitIndex) => {
        //data update location
        if (location && location._id) {
          return map(
            filter(dataUnits, (item) => item.parent === unitItem._id),
            (childUnit, childIndex) => {
              return Object.assign(
                childUnit.id ? { id: childUnit.id } : {},
                {
                  status: childUnit.status,
                  name: childUnit.name,
                  maxOccupants: childUnit.maxOccupants,
                  position: childIndex + 1,
                  // parent: unitItem._id,
                  childs: map(
                    filter(dataUnits, (item) => item.parent === childUnit._id),
                    (childUnitSub, subIndex) => {
                      return Object.assign(
                        childUnitSub.id ? { id: childUnitSub.id } : {},
                        {
                          status: childUnitSub.status,
                          name: childUnitSub.name,
                          maxOccupants: childUnitSub.maxOccupants,
                          position: subIndex + 1,
                        },
                        childUnitSub.delete ? { delete: true } : {},
                      );
                    },
                  ),
                },
                childUnit.delete ? { delete: true } : {},
              );
            },
          );
        }
        //data create location
        return Object.assign(
          unitItem.id ? { id: unitItem.id } : {},
          {
            name: unitItem.name,
            maxOccupants: unitItem.maxOccupants,
            position: unitIndex + 1,
            childs: map(
              filter(dataUnits, (item) => item.parent === unitItem._id),
              (childUnit, childIndex) => {
                return Object.assign(
                  childUnit.id ? { id: childUnit.id } : {},
                  {
                    status: childUnit.status,
                    name: childUnit.name,
                    maxOccupants: childUnit.maxOccupants,
                    position: childIndex + 1,
                  },
                  childUnit.delete ? { delete: true } : {},
                );
              },
            ),
          },
          unitItem.delete ? { delete: true } : {},
        );
      },
    );
    // console.log('tree before: ', trees);
    if (location && location._id) {
      if (trees[0]) {
        trees = trees[0];
      }
    } else {
      trees = filter(trees, (item) => item.name);
    }
    return trees;
  };

  const handleSaveData = (values, costCenter) => {
    // prevent try to submit when submitting
    if (loadingStateProvider.isSubmittingStatusProvider) return;
    setIsSubmitting(true);
    delete values.regionSelect;
    delete values.countrySelect;
    delete values.costcenterSelect;
    values.descriptions = filter(
      descriptions || [],
      (itemDes) => itemDes.key || itemDes.value,
    );
    values.locationContacts = map(locationContacts, (item) => {
      return Object.assign(
        item.id ? { id: item.id } : {},
        {
          contactId: item._id,
          type: item.type,
          description: item.description,
        },
        item.delete ? { delete: item.delete } : {},
      );
    });
    values.units = createTreeUnits(units);
    // Display loading icon request
    dispatch(loadingProviderActions.setStatusLoadingProvider());
    if (locationIdSelected) {
      hanldeUpdateLocation(locationIdSelected, values);
    } else {
      hanldeCreateLocation(values, costCenter);
    }
    setIsSubmitting(false);
  };
  const hanldeCreateLocation = (locationData, costCenter) => {
    dispatch(locationActions.submitCreateLocation(locationData, costCenter));
    // setInitAppData();
  };
  const hanldeUpdateLocation = (locationId, locationData) => {
    dispatch(locationActions.submitUpdateLocation(locationId, locationData));
    // setInitAppData();
  };
  // auto hidden notification after 5s
  if (notification && notification.message) {
    setTimeout(() => {
      dispatch(locationActions.resetNotification());
    }, 5000);
  }

  const handleChangeActive = (activeStatus) => {
    setStatusActive(activeStatus);
    setValue("active", activeStatus);
  };
  const onChangeTabs = (key) => {
    setActiveKeyTab(key);
  };

  // Submit & validation form data
  const handleSumbitFormData = async () => {
    const isValidForm = await triggerValidation();
    if (isValidForm) {
      setIsSumitedInvalid(false);
      // Open model create location & auto generate checkbox
      if (!locationIdSelected && isAllowGenerateCostCenter) {
        onToggleOpenGenerateCostCenter();
        return;
      }
      handleSaveData(getValues());
    } else {
      // switch tabs when current tab is units
      if (activeKeyTab === "2") {
        setActiveKeyTab("1");
      }
      setIsSumitedInvalid(true);
    }
  };

  // Focus filed of form when submit error validation
  const handleFocusInput = useCallback((errorsForm = {}) => {
    forEach(errorsForm, (errorItem, key) => {
      if (key.includes("message")) {
        key = key.split(".message")[0];
      }
      // get form data to handle focus error
      const formGeneral = document.forms["form-location-general"];

      // handle focus postalCode before city & costcenter

      if (["countrySelect", "regionSelect", "costcenterSelect"].includes(key)) {
        if (
          (key === "costcenterSelect" && !errorsForm["postalCode"]) ||
          key !== "costcenterSelect"
        ) {
          if (childRef.current) {
            childRef.current.handleFocusError(key);
            return false;
          }
        }
      } else if (formGeneral && formGeneral[key]) {
        if ((key === "city" && !errorsForm["postalCode"]) || key !== "city") {
          formGeneral[key].focus();
          return false;
        }
      }
    });
  }, []);

  useEffect(() => {
    if (isSumitedInvalid) {
      handleFocusInput(errors);
    }
  }, [isSumitedInvalid, errors, handleFocusInput]);

  const onToggleOpenGenerateCostCenter = () => {
    setOpenGenerateCostCenter(!isOpenGenerateCostCenter);
  };
  useEffect(() => {
    const unsubscribe = () => {
      console.log("unsubscribe");
    };
    return () => unsubscribe();
  });
  const locationdentify = Utils.getLocationIdentifer(watchAllFields);
  return (
    <Fragment>
      <PageLayout>
        <PageTitle
          heading={
            locationdentify.trim() ? (
              locationdentify
            ) : (
              <FormattedMessage id="components.pageTitle.newLocation" />
            )
          }
          icon="page-title-custom-icon nav-icon-locations"
          hasAction={true}
          hasActionName={<FormattedMessage id="components.button.save" />}
          checkboxParam={{
            value: isActive,
            handleChange: () => handleChangeActive(!isActive),
          }}
          handleSubmit={handleSumbitFormData}
        />
        {notification && notification.message ? (
          <Alert
            color={notification.type === "success" ? "success" : "danger"}
            isOpen={!!notification.message}
          >
            {Utils.showNotify(intl, notification)}
          </Alert>
        ) : null}
        <Tabs
          activeKey={activeKeyTab}
          onChange={onChangeTabs}
          renderTabBar={() => <ScrollableInkTabBar />}
          renderTabContent={() => <TabContent />}
        >
          <TabPane
            tab={<FormattedMessage id="components.formTitle.general" />}
            key="1"
          >
            <GeneralTab
              ref={childRef}
              locationIdSelected={locationIdSelected}
              location={location}
              countries={countries}
              costCenters={costCenters}
              getValues={getValues}
              register={register}
              errors={errors}
              isSubmitting={isSubmitting}
              triggerValidation={triggerValidation}
              setValue={setValue}
              setIsSubmitting={setIsSubmitting}
              locationContacts={locationContacts}
              setLocationContacts={setLocationContacts}
              descriptions={descriptions}
              setDescriptions={setDescriptions}
              watchAllFields={watchAllFields}
              formState={formState}
              clearError={clearError}
              setError={setError}
              unregister={unregister}
              intl={intl}
              isAllowGenerateCostCenter={isAllowGenerateCostCenter}
              setIsGenerateCostCenter={() =>
                setIsGenerateCostCenter(!isAllowGenerateCostCenter)
              }
            />
          </TabPane>
          <TabPane
            tab={<FormattedMessage id="components.formTitle.unitAndSubUnit" />}
            key="2"
          >
            <UnitsAndSubUnitsTab
              register={register}
              errors={errors}
              units={units}
              setUnits={setUnits}
              location={location}
              intl={intl}
              clearError={clearError}
              orderByPosition={orderByPosition}
            />
          </TabPane>
        </Tabs>
        <ModalGenerateCostCenter
          intl={intl}
          locationdentify={locationdentify}
          isOpen={isOpenGenerateCostCenter}
          onToggleOpen={onToggleOpenGenerateCostCenter}
          onSubmit={(costCenter) => handleSaveData(getValues(), costCenter)}
        />
      </PageLayout>
    </Fragment>
  );
}

export default memo(injectIntl(LocationEdit));
