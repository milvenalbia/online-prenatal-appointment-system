import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 36,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.2,
  },
  header: {
    textAlign: 'center',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    fontSize: 10,
  },
  infoColumn: {
    width: '48%',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'center',
  },
  infoLabel: {
    minWidth: 80,
    marginRight: 5,
  },
  infoValue: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    flex: 1,
    paddingHorizontal: 3,
    minHeight: 14,
    paddingBottom: 2,
  },
  mainTable: {
    borderWidth: 2,
    borderColor: 'black',
    borderStyle: 'solid',
    fontSize: 9,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    flexDirection: 'row',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
  },
  tableSubHeaderRow: {
    flexDirection: 'row',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    minHeight: 25,
  },
  emptyTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    borderBottomStyle: 'solid',
    minHeight: 22,
  },
  cell: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
    padding: 2,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    borderRightWidth: 1,
    borderRightColor: 'black',
    borderRightStyle: 'solid',
    padding: 2,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    fontSize: 8,
    fontWeight: 'bold',
  },
  nameCell: {
    textAlign: 'left',
    paddingLeft: 5,
  },
  // Column widths
  noCell: { width: 25 },
  nameCellWidth: { width: 100 },
  ageCell: { width: 30 },
  gravidityCell: { width: 50 },
  parityCell: { width: 40 },
  deliverySubcell: { width: 30, fontSize: 7 },
  checkupSubcell: { width: 70, fontSize: 7 },
  outcomeSubcell: { width: 50, fontSize: 7 },
  prenatalSubcell: { width: 60, fontSize: 7 },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    fontSize: 10,
  },
  bottomColumn: {
    width: '48%',
  },
  multiLine: {
    fontSize: 7,
    lineHeight: 1.0,
  },
});

const PregnancyTrackingPDF = ({ formData, patientType }) => {
  const currentYear = new Date().getFullYear();

  const getPatientName = () => {
    return formData.fullname;
  };

  const getEDCValues = () => {
    if (formData.edc) {
      const date = new Date(formData.edc);

      return {
        month: date.getMonth() + 1,
        day: date.getDate(),
        year: date.getFullYear(),
      };
    }
    return { month: '', day: '', year: '' };
  };

  const edc = getEDCValues();

  return (
    <Document>
      <Page size='A4' orientation='landscape' style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            National Safe Motherhood Program
          </Text>
          <Text style={styles.headerSubtitle}>PREGNANCY TRACKING</Text>
        </View>

        {/* Top Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Year:</Text>
              <Text style={styles.infoValue}>
                {new Date(formData.created_at).getFullYear()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Region:</Text>
              <Text style={styles.infoValue}>{formData.region || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Province:</Text>
              <Text style={styles.infoValue}>{formData.province || ''}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Municipality:</Text>
              <Text style={styles.infoValue}>
                {formData.municipality || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Barangay:</Text>
              <Text style={styles.infoValue}>{formData.barangay || ''}</Text>
            </View>
          </View>
          <View style={styles.infoColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Birthing Center:</Text>
              <Text style={styles.infoValue}>
                {formData.birthing_center || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {formData.birthing_center_address || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Referral Center:</Text>
              <Text style={styles.infoValue}>
                {formData.referral_center || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Address:</Text>
              <Text style={styles.infoValue}>
                {formData.referral_center_address || ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Table */}
        <View style={styles.mainTable}>
          {/* Table Header - First Row */}
          <View style={[styles.tableHeaderRow, styles.tableHeader]}>
            <View
              style={[
                styles.headerCell,
                styles.noCell,
                { borderBottomWidth: 0, borderBottomColor: 'transparent' },
              ]}
            >
              <Text>No.</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.nameCellWidth,
                { borderBottomWidth: 0, borderBottomColor: 'transparent' },
              ]}
            >
              <Text>Name</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.ageCell,
                { borderBottomWidth: 0, borderBottomColor: 'transparent' },
              ]}
            >
              <Text>Age</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.gravidityCell,
                { borderBottomWidth: 0, borderBottomColor: 'transparent' },
              ]}
            >
              <Text>Gravidity</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.parityCell,
                { borderBottomWidth: 0, borderBottomColor: 'transparent' },
              ]}
            >
              <Text>Parity</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                {
                  width: 90,
                  borderBottomWidth: 0,
                  borderBottomColor: 'transparent',
                },
              ]}
            >
              <Text style={styles.multiLine}>
                Expected Date of{'\n'}Delivery
              </Text>
            </View>
            <View
              style={[
                styles.headerCell,
                {
                  width: 280,
                  borderBottomWidth: 0,
                  borderBottomColor: 'transparent',
                },
              ]}
            >
              <Text>Antenatal Care Check-Ups</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                {
                  width: 200,
                  borderBottomWidth: 0,
                  borderBottomColor: 'transparent',
                },
              ]}
            >
              <Text style={styles.multiLine}>Pregnancy{'\n'}Outcome</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                {
                  width: 120,
                  borderBottomWidth: 0,
                  borderBottomColor: 'transparent',
                  borderRightWidth: 0,
                },
              ]}
            >
              <Text style={styles.multiLine}>
                Mother and Child{'\n'}Prenatal Check-up
              </Text>
            </View>
          </View>

          {/* Table Header - Second Row */}
          <View style={[styles.tableSubHeaderRow, styles.tableHeader]}>
            <View
              style={[
                styles.headerCell,
                styles.noCell,
                {
                  backgroundColor: 'transparent',
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderRightColor: 'transparent',
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.nameCellWidth,
                {
                  borderBottomWidth: 1,
                  backgroundColor: 'transparent',
                  borderRightWidth: 1,
                  borderRightColor: 'transparent',
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.ageCell,
                {
                  borderBottomWidth: 1,
                  backgroundColor: 'transparent',
                  borderRightWidth: 1,
                  borderRightColor: 'transparent',
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.gravidityCell,
                {
                  borderBottomWidth: 1,
                  backgroundColor: 'transparent',
                  borderRightWidth: 1,
                  borderRightColor: 'transparent',
                },
              ]}
            />
            <View
              style={[
                styles.headerCell,
                styles.parityCell,
                {
                  borderBottomWidth: 1,
                  backgroundColor: 'transparent',
                  borderRightWidth: 1,
                  borderRightColor: 'transparent',
                },
              ]}
            />

            <View
              style={[
                styles.headerCell,
                styles.deliverySubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text>Month</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.deliverySubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text>Day</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.deliverySubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text>Year</Text>
            </View>

            <View
              style={[
                styles.headerCell,
                styles.checkupSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text style={styles.multiLine}>1st visit{'\n'}Date</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.checkupSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text style={styles.multiLine}>2nd visit{'\n'}Date</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.checkupSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text style={styles.multiLine}>3rd visit{'\n'}Date</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.checkupSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text style={styles.multiLine}>
                4th visit{'\n'}or more{'\n'}Date
              </Text>
            </View>

            <View
              style={[
                styles.headerCell,
                styles.outcomeSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text>Live Birth</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.outcomeSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text>Preterm Birth</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.outcomeSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text>Stillbirth</Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.outcomeSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text>Abortion</Text>
            </View>

            <View
              style={[
                styles.headerCell,
                styles.prenatalSubcell,
                { borderBottomWidth: 1 },
              ]}
            >
              <Text style={styles.multiLine}>
                Day of Discharge/{'\n'}24 hours after birth
              </Text>
            </View>
            <View
              style={[
                styles.headerCell,
                styles.prenatalSubcell,
                { borderRightWidth: 0, borderBottomWidth: 1 },
              ]}
            >
              <Text style={styles.multiLine}>
                Within 7 days{'\n'}after birth
              </Text>
            </View>
          </View>

          {/* Data Row */}
          <View style={styles.tableRow}>
            <View style={[styles.cell, styles.noCell]}>
              <Text>1</Text>
            </View>
            <View style={[styles.cell, styles.nameCellWidth, styles.nameCell]}>
              <Text>{getPatientName()}</Text>
            </View>
            <View style={[styles.cell, styles.ageCell]}>
              <Text>{formData.age || ''}</Text>
            </View>
            <View style={[styles.cell, styles.gravidityCell]}>
              <Text>{formData.gravidity || ''}</Text>
            </View>
            <View style={[styles.cell, styles.parityCell]}>
              <Text>{formData.parity || ''}</Text>
            </View>
            <View style={[styles.cell, styles.deliverySubcell]}>
              <Text>{edc.month}</Text>
            </View>
            <View style={[styles.cell, styles.deliverySubcell]}>
              <Text>{edc.day}</Text>
            </View>
            <View style={[styles.cell, styles.deliverySubcell]}>
              <Text>{edc.year}</Text>
            </View>
            {/* Empty cells for the rest of the columns */}
            {Array.from({ length: 10 }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.cell,
                  index < 4
                    ? styles.checkupSubcell
                    : index < 8
                    ? styles.outcomeSubcell
                    : styles.prenatalSubcell,
                  index === 9 ? { borderRightWidth: 0 } : {},
                ]}
              >
                <Text></Text>
              </View>
            ))}
          </View>

          {/* Empty Rows */}
          {Array.from({ length: 9 }).map((_, rowIndex) => (
            <View key={rowIndex} style={styles.emptyTableRow}>
              <View style={[styles.cell, styles.noCell]}>
                <Text>{rowIndex + 2}</Text>
              </View>
              {Array.from({ length: 17 }).map((_, cellIndex) => (
                <View
                  key={cellIndex}
                  style={[
                    styles.cell,
                    cellIndex === 0
                      ? styles.nameCellWidth
                      : cellIndex === 1
                      ? styles.ageCell
                      : cellIndex === 2
                      ? styles.gravidityCell
                      : cellIndex === 3
                      ? styles.parityCell
                      : cellIndex >= 4 && cellIndex <= 6
                      ? styles.deliverySubcell
                      : cellIndex >= 7 && cellIndex <= 10
                      ? styles.checkupSubcell
                      : cellIndex >= 11 && cellIndex <= 14
                      ? styles.outcomeSubcell
                      : styles.prenatalSubcell,
                    cellIndex === 0 ? styles.nameCell : {},
                    cellIndex === 16 ? { borderRightWidth: 0 } : {},
                  ]}
                >
                  <Text></Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <View style={styles.bottomColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name of BHW:</Text>
              <Text style={styles.infoValue}>
                {formData.barangay_worker_name || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name of Midwife:</Text>
              <Text style={styles.infoValue}>
                {formData.midwife_name || ''}
              </Text>
            </View>
          </View>
          <View style={styles.bottomColumn}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Barangay Health Station:</Text>
              <Text style={styles.infoValue}>
                {formData.health_station || ''}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rural Health Unit:</Text>
              <Text style={styles.infoValue}>
                {formData.rural_health_unit || ''}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default PregnancyTrackingPDF;
