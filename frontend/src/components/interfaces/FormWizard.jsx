import { useEffect, useRef, useState } from 'react';
import { useFormSubmit } from '../../utils/functions';
import PatientTypeStep from './form-wizard/PatientTypeStep';
import PersonalDetailsStep from './form-wizard/PesronalDetailsStep';
import HealthInformationStep from './form-wizard/HealthInformationStep';
import PregnancyReviewInterface from './form-wizard/PregnancyTrackingReviewIternface';
import StepIndicator from './form-wizard/StepIndicator';
import NavigationButtons from './form-wizard/NavigationButtons';
import { printPdf } from './form-wizard/pdf/PrintToPdf.js';

const FormWizard = ({ row = null }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientType, setPatientType] = useState('');
  const [pregnancyTrackingId, setPregnancyTrackingId] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const printRef = useRef();

  const [pregnancyTrackingData, setPregnancyTrackingData] = useState(null);
  const [savedFormData, setSavedFormData] = useState({});

  // Without Value FormData
  // const [formData, setFormData] = useState({
  //   age: '',
  //   barangay: '',
  //   barangay_center_id: '',
  //   barangay_health_station: '',
  //   barangay_worker_id: '',
  //   birth_date: '',
  //   birth_place: '',
  //   birthing_center: 'St. Paul Hospital',
  //   birthing_center_address: 'Poblacion Tagoloan',
  //   contact: '',
  //   contact_person_name: '',
  //   contact_person_number: '',
  //   contact_person_relationship: '',
  //   edc: '',
  //   firstname: '',
  //   gravidity: '',
  //   lastname: '',
  //   lmp: '',
  //   middlename: '',
  //   midwife_id: '',
  //   municipality: '',
  //   parity: '',
  //   patient_id: '',
  //   patient_type: '',
  //   province: '',
  //   referral_center: 'St. Paul Hospital',
  //   referral_center_address: 'Poblacion Tagoloan',
  //   region: '',
  //   religion: '',
  //   rural_health_unit: 'Tagoloan RHU',
  //   sex: 'female',
  //   status: '',
  //   barangay_name: '',
  //   barangay_worker_name: '',
  //   midwife_name: '',
  //   municipality_name: '',
  //   province_name: '',
  //   region_name: '',
  //   zone: '',
  // });

  // With Value FormData for testing
  const [formData, setFormData] = useState({
    age: '25',
    barangay: 32991,
    barangay_center_id: 2,
    barangay_health_station: 'Mohon Health Station',
    barangay_worker_id: 3,
    birth_date: '2002-08-06',
    birth_place: 'Tagoloan Misamis Oriental',
    birthing_center: 'Mohon Center',
    birthing_center_address: 'Mohon Tagoloan',
    contact: '639637475332',
    contact_person_name: 'Mae  A. Pragas',
    contact_person_number: '639871233542',
    contact_person_relationship: 'Sister',
    edc: '2026-04-14',
    firstname: 'Laila',
    gravidity: '2',
    lastname: 'Pragas',
    lmp: '2025-06-08',
    middlename: 'Ando',
    midwife_id: 1,
    municipality: 1250,
    parity: '1',
    patient_id: '',
    patient_type: 'new',
    province: 57,
    referral_center: 'St. Paul Tagoloan',
    referral_center_address: 'Tagoloan Misamis Oriental',
    region: 13,
    religion: 'Roman Catholic',
    rural_health_unit: 'Tagoloan RHU',
    sex: 'female',
    status: 'single',
    zone: 'Zone 4',
    barangay_name: '',
    barangay_worker_name: '',
    midwife_name: '',
    municipality_name: '',
    province_name: '',
    region_name: '',
  });

  const { handleSubmit, isSubmitting, error, setError, data } = useFormSubmit();

  const steps = [
    {
      number: 1,
      title: 'Patient Information',
      description: 'Basic patient details',
    },
    {
      number: 2,
      title: 'Personal Details',
      description: 'Contact and address information',
    },
    {
      number: 3,
      title: 'Health Information',
      description: 'Medical and tracking details',
    },
    {
      number: 4,
      title: 'Review & Submit',
      description: 'Please review all information before submitting',
    },
  ];

  //   const { handlePrint } = printPdf(formData, patientType);

  const handleNewRecord = () => {
    if (isEdit) {
      setIsEdit(false);
      setPregnancyTrackingId(0);
    }
    setCurrentStep(1);
    setIsSubmitted(false);
    setPregnancyTrackingData(null);
    setSavedFormData({});
    setFormData({
      age: '',
      barangay: '',
      barangay_center_id: '',
      barangay_health_station: '',
      barangay_worker_id: '',
      birth_date: '',
      birth_place: '',
      birthing_center: 'St. Paul Hospital',
      birthing_center_address: 'Poblacion Tagoloan',
      contact: '',
      contact_person_name: '',
      contact_person_number: '',
      contact_person_relationship: '',
      edc: '',
      firstname: '',
      gravidity: '',
      lastname: '',
      lmp: '',
      middlename: '',
      midwife_id: '',
      municipality: '',
      parity: '',
      patient_id: '',
      patient_type: '',
      province: '',
      referral_center: 'St. Paul Hospital',
      referral_center_address: 'Poblacion Tagoloan',
      region: '',
      religion: '',
      rural_health_unit: 'Tagoloan RHU',
      sex: 'female',
      status: '',
      zone: '',
      barangay_name: '',
      barangay_worker_name: '',
      midwife_name: '',
      municipality_name: '',
      province_name: '',
      region_name: '',
    });
  };

  const showToastError = true;

  const onSubmit = (e) => {
    setSavedFormData(formData);
    handleSubmit({
      e,
      showToastError,
      isEdit,
      url: isEdit
        ? `/api/pregnancy-trackings/${pregnancyTrackingId}`
        : '/api/pregnancy-trackings',
      formData,
      onSuccess: (record) => {
        setIsSubmitted(true);
        setPregnancyTrackingData(record);
      },
      onReset: () => {
        setFormData({
          age: '',
          barangay: '',
          barangay_center_id: '',
          barangay_health_station: '',
          barangay_worker_id: '',
          birth_date: '',
          birth_place: '',
          birthing_center: 'St. Paul Hospital',
          birthing_center_address: 'Poblacion Tagoloan',
          contact: '',
          contact_person_name: '',
          contact_person_number: '',
          contact_person_relationship: '',
          edc: '',
          firstname: '',
          gravidity: '',
          lastname: '',
          lmp: '',
          middlename: '',
          midwife_id: '',
          municipality: '',
          parity: '',
          patient_id: '',
          patient_type: '',
          province: '',
          referral_center: 'St. Paul Hospital',
          referral_center_address: 'Poblacion Tagoloan',
          region: '',
          religion: '',
          rural_health_unit: 'Tagoloan RHU',
          sex: 'female',
          status: '',
          zone: '',
          barangay_name: '',
          barangay_worker_name: '',
          midwife_name: '',
          municipality_name: '',
          province_name: '',
          region_name: '',
        });
        setError({});
        if (isEdit) {
          setPregnancyTrackingId(0);
          setIsEdit(false);
        }
      },
    });
  };

  useEffect(() => {
    if (row) {
      setIsEdit(true);
      setPatientType('edit');
      setPregnancyTrackingId(row.id);
      setFormData({
        firstname: row.firstname,
        lastname: row.lastname,
        middlename: row.middlename,
        age: row.age,
        sex: row.sex,
        status: row.status,
        birth_date: row.birth_date,
        birth_place: row.birth_place,
        religion: row.religion,
        contact: row.contact,
        contact_person_name: row.contact_person_name,
        contact_person_number: row.contact_person_number,
        contact_person_relationship: row.contact_person_relationship,
        region: row.region_id,
        province: row.province_id,
        municipality: row.municipality_id,
        barangay: row.barangay_id,
        // Tracking fields
        barangay_center_id: row.barangay_center_id,
        barangay_worker_id: row.barangay_worker_id,
        midwife_id: row.midwife_id,
        gravidity: row.gravidity,
        parity: row.parity,
        lmp: row.lmp,
        edc: row.edc,
        birthing_center: row.birthing_center,
        birthing_center_address: row.birthing_center_address,
        referral_center: row.referral_center,
        referral_center_address: row.referral_center_address,
        barangay_health_station: row.health_station,
        rural_health_unit: row.rural_health_unit,
        // Existing patient
        patient_id: row.patient_id,
        zone: row.zone,
        barangay_name: row.barangay,
        barangay_worker_name: row.barangay_worker_name,
        midwife_name: row.midwife_name,
        municipality_name: row.municipality,
        province_name: row.province,
        region_name: row.region,
      });
      setSavedFormData({
        firstname: row.firstname,
        lastname: row.lastname,
        middlename: row.middlename,
        age: row.age,
        sex: row.sex,
        status: row.status,
        birth_date: row.birth_date,
        birth_place: row.birth_place,
        religion: row.religion,
        contact: row.contact,
        contact_person_name: row.contact_person_name,
        contact_person_number: row.contact_person_number,
        contact_person_relationship: row.contact_person_relationship,
        region: row.region_id,
        province: row.province_id,
        municipality: row.municipality_id,
        barangay: row.barangay_id,
        // Tracking fields
        barangay_center_id: row.barangay_center_id,
        barangay_worker_id: row.barangay_worker_id,
        midwife_id: row.midwife_id,
        gravidity: row.gravidity,
        parity: row.parity,
        lmp: row.lmp,
        edc: row.edc,
        birthing_center: row.birthing_center,
        birthing_center_address: row.birthing_center_address,
        referral_center: row.referral_center,
        referral_center_address: row.referral_center_address,
        barangay_health_station: row.health_station,
        rural_health_unit: row.rural_health_unit,
        // Existing patient
        patient_id: row.patient_id,
        zone: row.zone,
        barangay_name: row.barangay,
        barangay_worker_name: row.barangay_worker_name,
        midwife_name: row.midwife_name,
        municipality_name: row.municipality,
        province_name: row.province,
        region_name: row.region,
      });
    }
  }, [row]);

  const inputChange = (e, phoneNumber = null) => {
    const { name, value } = e.target;
    if (phoneNumber) {
      setFormData((prev) => ({ ...prev, [name]: phoneNumber }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PatientTypeStep
            patientType={patientType}
            setPatientType={setPatientType}
            formData={formData}
            isEdit={isEdit}
            setFormData={setFormData}
            inputChange={inputChange}
            error={error}
          />
        );
      case 2:
        return (
          <PersonalDetailsStep
            patientType={patientType}
            formData={formData}
            setFormData={setFormData}
            inputChange={inputChange}
            error={error}
          />
        );
      case 3:
        return (
          <HealthInformationStep
            formData={formData}
            setFormData={setFormData}
            inputChange={inputChange}
            error={error}
          />
        );
      case 4:
        return (
          <PregnancyReviewInterface
            pregnancyTrackingData={pregnancyTrackingData}
            formData={formData}
            isSubmitted={isSubmitted}
            patientType={patientType}
            savedFormData={savedFormData}
            handleNewRecord={handleNewRecord}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className='w-full mx-auto sm:p-4'>
      <StepIndicator steps={steps} currentStep={currentStep} error={error} />

      <div className='bg-white border border-gray-200 rounded-lg p-6 mb-6'>
        {renderStepContent()}
      </div>

      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        patientType={patientType}
        isSubmitted={isSubmitted}
        isSubmitting={isSubmitting}
        onPrevious={prevStep}
        isEdit={isEdit}
        onNext={nextStep}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default FormWizard;
