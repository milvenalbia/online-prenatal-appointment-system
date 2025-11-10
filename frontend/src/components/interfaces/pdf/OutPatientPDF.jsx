import React, { useState } from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 20,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 25,
  },
  hospitalName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  hospitalSubtitle: {
    fontSize: 9,
    marginBottom: 20,
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  formSection: {
    marginBottom: 15,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginRight: 5,
    width: 100,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    flex: 1,
    height: 12,
    marginRight: 15,
  },
  shortUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    width: 80,
    height: 12,
    marginRight: 10,
  },
  vitalSignsTable: {
    borderWidth: 1,
    borderColor: '#000000',
    borderStyle: 'solid',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: '#F0F0F0',
    padding: 8,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    flex: 1,
  },
  tableCell: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    fontSize: 9,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#000000',
    borderRightStyle: 'solid',
    flex: 1,
    height: 25,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  commentsSection: {
    borderWidth: 2,
    borderColor: '#000000',
    borderStyle: 'solid',
    minHeight: 300,
    marginTop: 20,
    padding: 10,
  },
  commentsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataText: {
    fontSize: 9,
    marginBottom: 1,
  },
});

// PDF Document Component
const OutPatientDocument = ({ formData = {} }) => (
  <Document>
    <Page size='A4' style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.hospitalName}>SAINT PAUL HOSPITAL</Text>
        <Text style={styles.hospitalSubtitle}>TAGOLOAN, MISAMIS ORIENTAL</Text>
      </View>

      <Text style={styles.title}>OUT-PATIENT RECORD SHEET</Text>

      <View style={styles.formSection}>
        <View style={[styles.formRow, { marginBottom: 20 }]}>
          <Text style={[styles.label, { width: 80 }]}>FILE NUMBER</Text>
          <View style={[styles.underline, { width: 150 }]}>
            <Text style={styles.dataText}>{formData.file_number || ''}</Text>
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>NAME</Text>
          <View style={styles.underline}>
            <Text style={styles.dataText}>
              {formData.lastname || ''} {formData.firstname || ''}{' '}
              {formData.middlename || ''}
            </Text>
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>ADDRESS</Text>
          <View style={styles.underline}>
            <Text style={styles.dataText}>{formData.address || ''}</Text>
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>AGE</Text>
          <View style={styles.shortUnderline}>
            <Text style={styles.dataText}>{formData.age || ''}</Text>
          </View>
          <Text style={[styles.label, { width: 60 }]}>SEX</Text>
          <View style={styles.shortUnderline}>
            <Text style={styles.dataText}>{formData.sex || ''}</Text>
          </View>
        </View>
      </View>

      <View style={styles.vitalSignsTable}>
        <View style={styles.tableRow}>
          {[
            'DATE',
            'TIME',
            'WEIGHT',
            'HEIGHT',
            'TEMP',
            'RR',
            'PR',
            'O2 SAT',
            'BP',
          ].map((header, i) => (
            <Text
              key={header}
              style={[styles.tableHeader, i === 8 && styles.lastCell]}
            >
              {header}
            </Text>
          ))}
        </View>

        <View style={styles.tableRow}>
          {[
            formData.date,
            formData.time,
            formData.weight,
            formData.height,
            formData.temp,
            formData.rr,
            formData.pr,
            formData.o2_sat,
            formData.bp,
          ].map((cell, i) => (
            <Text
              key={i}
              style={[styles.tableCell, i === 8 && styles.lastCell]}
            >
              {cell || ''}
            </Text>
          ))}
        </View>
      </View>

      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>Comments</Text>
        <Text style={styles.dataText}>{formData.comments || ''}</Text>
      </View>
    </Page>
  </Document>
);

// Main Component
const OutPatientPDF = ({ formData = {} }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(
        <OutPatientDocument formData={formData} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `outpatient_record_${formData.lastname || 'record'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const buttonStyle = {
    backgroundColor: loading ? '#ccc' : '#1a73e8',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    borderWidth: 0,
    fontWeight: 'bold',
    cursor: loading ? 'not-allowed' : 'pointer',
    fontSize: '14px',
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <button onClick={handleDownload} disabled={loading} style={buttonStyle}>
        {loading ? 'Preparing document...' : 'Download Out-Patient Record'}
      </button>
    </div>
  );
};

export default OutPatientPDF;
