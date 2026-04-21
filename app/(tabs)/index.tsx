import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

type Screen = 'splash' | 'login' | 'dashboard' | 'transactions' | 'requestStatement';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'login' | 'dashboard' | 'transactions' | 'requestStatement'>('splash');
  const [mpin, setMpin] = useState<string>('');
  const [includeSummary, setIncludeSummary] = useState(false);
  const [includeNominee, setIncludeNominee] = useState(false);
  const [showBalance, setShowBalance] = useState(false); // State to toggle balance visibility
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };
  
  // Dropdown states
  const [duration, setDuration] = useState('Duration');
  const [financialYear, setFinancialYear] = useState('Financial Year');
  const [format, setFormat] = useState('PDF');
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'duration' | 'year' | 'format'>('none');

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('login');
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleMpinChange = (text: string) => {
    if (text.length <= 6) {
      setMpin(text);
      if (text === '189198') {
        setTimeout(() => setCurrentScreen('dashboard'), 300);
      }
    }
  };

  const toggleDropdown = (type: 'duration' | 'year' | 'format') => {
    setActiveDropdown(activeDropdown === type ? 'none' : type);
  };

  const [pdfVisible, setPdfVisible] = useState(false);
  const handleDownload = () => {
  setPdfVisible(true);
};



  // --- SCREEN 1: SPLASH ---
  if (currentScreen === 'splash') {
    return (
      <View style={styles.splashBackground}>
        <StatusBar barStyle="light-content" />
        <Image 
          source={{ uri: 'https://i.ibb.co/Fkw39Lg3/yonosbi-logo-removebg-preview.png' }} 
          style={styles.logoSplash} 
          resizeMode="contain" 
        />
      </View>
    );
  }

  // --- SCREEN 5: REQUEST STATEMENT ---
  if (currentScreen === 'requestStatement') {
    return (
      <SafeAreaView style={styles.dashboardContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.transHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('transactions')}>
            <Ionicons name="chevron-back" size={28} color="#4A148C" />
          </TouchableOpacity>
          <Text style={styles.requestHeaderText}>Request Statement</Text>
        </View>

        <ScrollView style={styles.flex1} contentContainerStyle={styles.ph20}>
          <View style={styles.formGroup}>
            <View style={styles.row}>
               <View style={styles.radioCircle} />
               <Text style={styles.labelSmall}>Select Duration</Text>
            </View>
            <TouchableOpacity style={styles.picker} onPress={() => toggleDropdown('duration')}>
              <Text style={styles.pickerText}>{duration}</Text>
              <Ionicons name="chevron-down" size={20} color="#4A148C" />
            </TouchableOpacity>
            {activeDropdown === 'duration' && (
              <View style={styles.dropdownList}>
                {['Last 3 months', 'Last 6 months', 'Last one year', 'Custom dates'].map(item => (
                  <TouchableOpacity key={item} style={styles.dropdownItem} onPress={() => { setDuration(item); setActiveDropdown('none'); }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <View style={styles.row}>
               <View style={styles.radioCircle} />
               <Text style={styles.labelSmall}>Select Financial Year</Text>
            </View>
            <TouchableOpacity style={styles.picker} onPress={() => toggleDropdown('year')}>
              <Text style={styles.pickerText}>{financialYear}</Text>
              <Ionicons name="chevron-down" size={20} color="#4A148C" />
            </TouchableOpacity>
            {activeDropdown === 'year' && (
              <View style={styles.dropdownList}>
                {['2022 - 2023', '2023 - 2024', '2024 - 2025', '2025 - 2026'].map(item => (
                  <TouchableOpacity key={item} style={styles.dropdownItem} onPress={() => { setFinancialYear(item); setActiveDropdown('none'); }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.labelVerySmall}>Format</Text>
            <TouchableOpacity style={styles.picker} onPress={() => toggleDropdown('format')}>
              <Text style={styles.pickerText}>{format}</Text>
              <Ionicons name="chevron-down" size={20} color="#4A148C" />
            </TouchableOpacity>
            {activeDropdown === 'format' && (
              <View style={styles.dropdownList}>
                {['PDF', 'Excel'].map(item => (
                  <TouchableOpacity key={item} style={styles.dropdownItem} onPress={() => { setFormat(item); setActiveDropdown('none'); }}>
                    <Text>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

{/* Full Screen PDF Modal */}
<Modal 
  visible={pdfVisible} 
  animationType="fade" 
  transparent={true} // Makes it look like a popup
  onRequestClose={() => setPdfVisible(false)}
>
  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: '80%', backgroundColor: '#FFF', padding: 25, borderRadius: 15, alignItems: 'center' }}>
      
      {/* Success Tick Icon */}
      <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />

      {/* Success Message */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginTop: 15 }}>
        Statement Sent!
      </Text>
      <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10 }}>
        Your statement has been sent to your registered email.
      </Text>

      {/* Close Button */}
      <TouchableOpacity 
        onPress={() => setPdfVisible(false)}
        style={{ marginTop: 20, backgroundColor: '#7B1FA2', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 25 }}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>OK</Text>
      </TouchableOpacity>
      
    </View>
  </View>
</Modal>



          <View style={styles.rowBetweenMargin}>
            <View style={styles.row}>
              <Text style={styles.switchLabel}>Include all account summary</Text>
              <Ionicons name="information-circle-outline" size={18} color="#4A148C" style={styles.ml5} />
            </View>
            <Switch value={includeSummary} onValueChange={setIncludeSummary} trackColor={{ false: "#DDD", true: "#BA68C8" }} />
          </View>

          <View style={styles.rowBetweenMargin}>
            <Text style={styles.switchLabel}>Include nominee details</Text>
            <Switch value={includeNominee} onValueChange={setIncludeNominee} trackColor={{ false: "#DDD", true: "#BA68C8" }} />
          </View>

          <View style={[styles.row, styles.mt10]}>
            <Text style={styles.passLogicText}>Password logic</Text>
            <Ionicons name="information-circle-outline" size={16} color="#4A148C" style={styles.ml5} />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={20} color="#4A148C" />
            <Text style={styles.infoBoxText}>Maximum 5 downloads per account in a day. 2000 transactions per download.</Text>
          </View>

          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.outlineBtn} onPress={handleDownload}><Text style={styles.outlineBtnText}>Email</Text></TouchableOpacity>
            <TouchableOpacity style={styles.outlineBtn}>
                <Text style={styles.outlineBtnText}>Download</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.digiLockerRow}>
            <Text style={styles.digiText}>Upload to DigiLocker</Text>
            <View style={styles.digiBrand}>
              <Text style={styles.digiMiniText}>DigiLocker</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SCREEN 4: TRANSACTIONS ---
  if (currentScreen === 'transactions') {
    return (
      <SafeAreaView style={styles.dashboardContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.transHeader}>
          <TouchableOpacity onPress={() => setCurrentScreen('dashboard')}>
            <Ionicons name="chevron-back" size={28} color="#555" />
          </TouchableOpacity>
          <Text style={styles.transHeaderText}>Transactions</Text>
          <View style={styles.row}>
            <Feather name="bell" size={22} color="#555" style={styles.headerIcon} />
            <MaterialIcons name="headset-mic" size={22} color="#555" />
          </View>
        </View>

        <View style={styles.transTabs}>
          <View style={styles.activeTabWrapper}>
            <Text style={styles.transTabActive}>Transaction Details</Text>
            <View style={styles.activeIndicatorLong} />
          </View>
          <Text style={styles.transTabText}>Spend Analysis</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.flex1}>
          <View style={styles.accountSelectorCard}>
            <Text style={styles.selectAccountLabel}>Select Account</Text>
            <View style={styles.accountBox}>
              <View style={styles.sbiIconCircle}>
                <Image source={{ uri: 'https://i.ibb.co/Fkw39Lg3/yonosbi-logo-removebg-preview.png' }} style={styles.sbiMiniLogo} />
              </View>
              <View style={styles.flex1}>
                <View style={styles.row}>
                  <Text style={styles.accountNumber}>XXXXXXX2249</Text>
                  <Ionicons name="eye-outline" size={18} color="#555" style={styles.ml10} />
                </View>
                <Text style={styles.accountType}>Savings Account</Text>
                <Text style={styles.availableBalanceLabel}>Available Balance: <Text style={styles.bold}>₹15,35,087.43</Text></Text>
              </View>
              <Ionicons name="chevron-down" size={24} color="#555" />
            </View>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#888" />
              <TextInput placeholder="Search here..." style={styles.searchInput} />
            </View>
            <MaterialCommunityIcons name="filter-variant" size={24} color="#555" style={styles.mh10} />
            <MaterialCommunityIcons name="swap-vertical" size={24} color="#555" />
          </View>

          <View style={styles.recentTransHeader}>
            <TouchableOpacity style={styles.row}>
              <Text style={styles.recentTransText}>Recent Transfers</Text>
              <Ionicons name="chevron-down" size={16} color="#4A148C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.requestStatementBtn} onPress={() => setCurrentScreen('requestStatement')}>
              <Text style={styles.requestStatementText}>Request Statement</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateSeparator}>
            <Text style={styles.dateText}>April 2026</Text>
          </View>

          <TransactionItem title="EPF- SALARY WTDR 470823..." date="20/04/2026" amount="11,04,704.45" balance="15,35,087.43" isCredit />
          <TransactionItem title="CHQ- TRANSFER TO 536344..." date="10/03/2026" amount="2,15,000.00" balance="4,04,768.23" />
          <TransactionItem title="UPI- TRANSFER TO 536233..." date="03/03/2026" amount="15,000.00" balance="4,19,568.23" />
          <TransactionItem title="UPI- TRANSFER TO 696395..." date="02/03/2026" amount="200.00" balance="4,04,768.23" />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- SCREEN 3: DASHBOARD ---
  if (currentScreen === 'dashboard') {
    if (isRefreshing) {
      return (
        <SafeAreaView style={[styles.dashboardContainer, styles.centerContent]}>
          <StatusBar barStyle="dark-content" />
          <ActivityIndicator size="large" color="#4A148C" />
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.dashboardContainer}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.dashHeader}>
          <View style={styles.row}>
            <View style={styles.avatarCircle}><Text style={styles.avatarText}>RT</Text></View>
            <View style={styles.ml10}>
              <Text style={styles.dashGreeting}>Hello <Text style={styles.bold}>Rishabh,</Text></Text>
              <Text style={styles.dashSub}>Let's get started!</Text>
            </View>
          </View>
          <View style={styles.row}>
            <Feather name="search" size={22} color="#555" style={styles.headerIcon} />
            <Feather name="bell" size={22} color="#555" style={styles.headerIcon} />
            <MaterialCommunityIcons name="logout" size={22} color="#555" />
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.dashTabs}>
            <Text style={[styles.dashTabActive, styles.dashTabText]}>Banking</Text>
            <Text style={styles.dashTabText}>Lifestyle</Text>
            <Text style={styles.dashTabText}>Rewards</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
            <LinearGradient colors={['#C2185B', '#880E4F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.bankCard}>
               <View style={styles.rowBetween}>
                  <Text style={styles.cardTitle}>TRANSACTION ACCOUNT (49)</Text>
                  <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                    <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={20} color="#FFF" />
                  </TouchableOpacity>
               </View>
               <Text style={styles.cardSub}>Total Balance</Text>
               <View style={styles.rowBetween}>
                 <Text style={styles.balanceText}>{showBalance ? '₹15,35,087.43' : 'XXXX,XXXX.XX'}</Text>
                 <TouchableOpacity onPress={handleRefresh}>
                   <MaterialCommunityIcons name="refresh" size={24} color="#FFF" />
                 </TouchableOpacity>
               </View>
               <View style={[styles.row, styles.mt20]}>
                  <Text style={styles.cardLink}>View Accounts</Text>
                  <TouchableOpacity onPress={() => setCurrentScreen('transactions')}>
                    <Text style={[styles.cardLink, styles.ml20]}>Transactions</Text>
                  </TouchableOpacity>
               </View>
            </LinearGradient>
            <View style={styles.investCard}>
               <Text style={styles.investTitle}>INVESTMENTS</Text>
               <Text style={styles.investSub}>Ready to start investing?</Text>
               <Text style={styles.investLink}>Invest Now</Text>
            </View>
          </ScrollView>

          <View style={styles.paySection}>
            <Text style={styles.sectionTitle}>Payments & Transfers</Text>
            <View style={styles.subTabRow}>
              <Text style={styles.subTabActive}>UPI</Text>
              <Text style={styles.subTabText}>Fund Transfer</Text>
              <Text style={styles.subTabText}>Bills</Text>
              <Text style={styles.subTabText}>Yono Cash</Text>
            </View>
            <View style={styles.upiAlert}>
              <MaterialIcons name="error" size={18} color="#D32F2F" />
              <Text style={styles.upiAlertText}>You haven't created a UPI...</Text>
              <Text style={styles.activateText}>Activate UPI ID</Text>
            </View>
            <View style={styles.upiGrid}>
               <DashGridItem icon="book-outline" label="Pay to mobile or contact" />
               <DashGridItem icon="phone-portrait-outline" label="Pay UPI ID or Number" />
               <DashGridItem icon="business-outline" label="Pay to Bank A/C" />
               <DashGridItem icon="eye-outline" label="View Transaction" />
            </View>

            {/* Banner Section Added Here */}
            <Image 
              source={{ uri: 'https://sbi.bank.in/documents/18605015/56894108/YONO+Homepage+Carousel+Banner+1.png/a658ae1b-bd9a-59f5-52e5-01b1f8a78c1c?t=1767952747595' }} 
              style={styles.dashboardBanner}
              resizeMode="stretch"
            />
          </View>
        </ScrollView>
        <View style={styles.bottomNavDash}>
           <NavItemDash icon="home" label="Home" active />
           <NavItemDash icon="hand-coin-outline" label="Loans" isMCI />
           <View style={styles.fabContainerDash}><View style={styles.fabDash}><MaterialCommunityIcons name="qrcode-scan" size={26} color="#FFF" /></View><Text style={styles.fabLabelDash}>Scan QR</Text></View>
           <NavItemDash icon="shield-check-outline" label="Insurance" isMCI />
           <NavItemDash icon="chart-line" label="Investments" isMCI />
        </View>
      </SafeAreaView>
    );
  }

  // --- SCREEN 2: LOGIN ---
  return (
    <LinearGradient colors={['#7B1FA2', '#F3E5F5']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View><Text style={styles.greeting}>Hello</Text><Text style={styles.userName}>Rishabh</Text></View>
          <View style={styles.headerRight}>
             <Image source={{ uri: 'https://i.ibb.co/Fkw39Lg3/yonosbi-logo-removebg-preview.png' }} style={styles.logoSmall} resizeMode="contain" />
              <TouchableOpacity style={styles.locateRow}><Ionicons name="location-sharp" size={14} color="#FFF" /><Text style={styles.locateText}> Locate Us</Text></TouchableOpacity>
          </View>
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>Login using MPIN</Text>
            <TouchableOpacity activeOpacity={1} onPress={() => inputRef.current?.focus()} style={styles.pinDisplayContainer}>
              {[...Array(6)].map((_, i) => (<View key={i} style={styles.pinBox}>{mpin.length > i && <View style={styles.bullet} />}</View>))}
            </TouchableOpacity>
            <TextInput ref={inputRef} value={mpin} onChangeText={handleMpinChange} keyboardType="number-pad" maxLength={6} style={styles.hiddenInput} autoFocus={true} />
            <TouchableOpacity style={styles.forgotBtn}><Text style={styles.forgotText}>Forgot MPIN?</Text></TouchableOpacity>
            <View style={styles.orRow}><View style={styles.line} /><Text style={styles.orText}> OR </Text><View style={styles.line} /></View>
            <TouchableOpacity><Text style={styles.loginWith}>Login with <Text style={styles.underline}>Username</Text></Text></TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.viewBalanceBtn}><Text style={styles.viewBalanceText}>View Balance</Text></TouchableOpacity>

          <View style={styles.tabSection}>
             <View style={styles.tabHeader}>
                <View style={styles.activeTabWrapper}><Text style={styles.tabTextActive}>Transact</Text><View style={styles.activeIndicator} /></View>
                <Text style={styles.tabText}>Calculators</Text><Text style={styles.tabText}>Offers</Text>
             </View>
             <View style={styles.grid}>
                <GridItem label="Pay to Mobile or Contact" /><GridItem label="Quick Transfer" /><GridItem label="Send Money" /><GridItem label="Bill Payments" />
             </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <View style={styles.bottomNav}>
         <NavItem icon={<Ionicons name="search" size={22} color="#666" />} label="Yono Cash" />
         <NavItem icon={<MaterialIcons name="headset-mic" size={22} color="#666" />} label="Contact Us" />
         <View style={styles.fabContainer}><View style={styles.fab}><MaterialCommunityIcons name="qrcode-scan" size={28} color="#FFF" /></View><Text style={styles.fabLabel}>Scan QR</Text></View>
         <NavItem icon={<Ionicons name="grid-outline" size={22} color="#666" />} label="Products" />
         <NavItem icon={<MaterialCommunityIcons name="dots-horizontal" size={22} color="#666" />} label="More" />
      </View>
    </LinearGradient>
  );
}

// --- COMPONENTS ---
const GridItem = ({ label }: { label: string }) => (<View style={styles.gridItem}><View style={styles.iconCircle} /><Text style={styles.gridLabel}>{label}</Text></View>);
const DashGridItem = ({ icon, label }: { icon: any, label: string }) => (
  <View style={styles.dashGridItem}><View style={styles.dashIconCircle}><Ionicons name={icon} size={24} color="#6A1B9A" /></View><Text style={styles.dashGridLabel}>{label}</Text></View>
);
const TransactionItem = ({ title, date, amount, balance, isCredit }: any) => (
  <View style={styles.transItem}><View style={styles.upiTag}></View>
    <View style={styles.rowBetween}><View style={styles.flex1}><Text style={styles.transTitle} numberOfLines={1}>{title}</Text><Text style={styles.transDate}>{date}</Text></View>
      <View style={styles.alignEnd}><View style={styles.row}><Text style={styles.transAmount}>₹{amount}</Text><Feather name={isCredit ? "arrow-down-left" : "arrow-up-right"} size={16} color={isCredit ? "#2E7D32" : "#D32F2F"} style={styles.ml5} /></View><Text style={styles.transBalance}>Balance: ₹{balance}</Text></View>
    </View>
  </View>
);
const NavItem = ({ icon, label }: { icon: any, label: string }) => (<TouchableOpacity style={styles.navItem}>{icon}<Text style={styles.navLabel}>{label}</Text></TouchableOpacity>);
const NavItemDash = ({ icon, label, active, isMCI }: { icon: any, label: string, active?: boolean, isMCI?: boolean }) => (
  <TouchableOpacity style={styles.navItem}>{isMCI ? <MaterialCommunityIcons name={icon} size={22} color={active ? '#6A1B9A' : '#666'} /> : <Ionicons name={icon} size={22} color={active ? '#6A1B9A' : '#666'} />}
    <Text style={[styles.navLabel, active && {color: '#6A1B9A', fontWeight: 'bold'}]}>{label}</Text></TouchableOpacity>
);

const styles = StyleSheet.create({
  flex1: { flex: 1 }, container: { flex: 1 }, safeArea: { flex: 1 }, row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowBetweenMargin: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  ph20: { paddingHorizontal: 20, paddingBottom: 40 }, ml5: { marginLeft: 5 }, ml10: { marginLeft: 10 }, ml20: { marginLeft: 20 }, mt10: { marginTop: 10 }, mt20: { marginTop: 20 }, mh10: { marginHorizontal: 10 },
  bold: { fontWeight: 'bold' }, centerContent: { justifyContent: 'center', alignItems: 'center' },
  splashBackground: { flex: 1, backgroundColor: '#4A148C', justifyContent: 'center', alignItems: 'center' },
  logoSplash: { width: width * 0.6, height: 150 }, header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  greeting: { color: '#FFF', fontSize: 16, opacity: 0.9 }, userName: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerRight: { alignItems: 'flex-end' }, logoSmall: { width: 80, height: 30 }, locateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  locateText: { color: '#FFF', fontSize: 12 }, loginCard: { backgroundColor: 'rgba(255,255,255,0.95)', margin: 16, borderRadius: 16, padding: 20, alignItems: 'center' },
  loginTitle: { fontSize: 16, color: '#4A148C', marginBottom: 20 }, pinDisplayContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 10 },
  pinBox: { width: 40, height: 45, borderWidth: 1, borderColor: '#BA68C8', borderRadius: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  bullet: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#4A148C' }, hiddenInput: { position: 'absolute', opacity: 0, width: 0, height: 0 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 10 }, forgotText: { color: '#4A148C', fontSize: 13, fontWeight: '600' },
  orRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, width: '100%' }, line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  orText: { color: '#888', paddingHorizontal: 10 }, loginWith: { color: '#4A148C', fontSize: 15 }, underline: { textDecorationLine: 'underline', fontWeight: 'bold' },
  viewBalanceBtn: { backgroundColor: '#6A1B9A', marginHorizontal: 16, padding: 14, borderRadius: 25, alignItems: 'center' },
  viewBalanceText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }, tabSection: { flex: 1, backgroundColor: '#FFF', marginTop: 25, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 },
  tabHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 10 },
  tabText: { color: '#999', fontSize: 16, fontWeight: '500' }, tabTextActive: { color: '#4A148C', fontSize: 16, fontWeight: 'bold' },
  activeIndicator: { width: 20, height: 3, backgroundColor: '#4A148C', marginTop: 4, borderRadius: 2 },
  activeIndicatorLong: { width: '100%', height: 3, backgroundColor: '#4A148C', marginTop: 4, borderRadius: 2 },
  activeTabWrapper: { alignItems: 'center' }, grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '23%', alignItems: 'center', marginBottom: 20 },
  iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F3E5F5', marginBottom: 8, borderWidth: 1, borderColor: '#E1BEE7' },
  gridLabel: { fontSize: 10, textAlign: 'center', color: '#555' }, bottomNav: { flexDirection: 'row', height: 80, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE', paddingBottom: 15 },
  navItem: { flex: 1, justifyContent: 'center', alignItems: 'center' }, navLabel: { fontSize: 10, color: '#666', marginTop: 4 },
  fabContainer: { flex: 1, alignItems: 'center', marginTop: -30 }, fab: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#6A1B9A', justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#FFF' },
  fabLabel: { fontSize: 10, color: '#4A148C', fontWeight: 'bold', marginTop: 4 }, dashboardContainer: { flex: 1, backgroundColor: '#F8F9FB' },
  dashHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
  avatarCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E1BEE7', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#4A148C', fontWeight: 'bold' }, dashGreeting: { fontSize: 18, color: '#333' }, dashSub: { fontSize: 14, color: '#777' },
  headerIcon: { marginRight: 15 }, dashTabs: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 }, dashTabText: { fontSize: 16, color: '#888', marginRight: 25 },
  dashTabActive: { color: '#4A148C', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#4A148C', paddingBottom: 5 },
  cardScroll: { paddingLeft: 20, marginBottom: 20 }, bankCard: { width: width * 0.75, borderRadius: 20, padding: 20, marginRight: 15, height: 160 },
  cardTitle: { color: '#FFF', fontSize: 11, opacity: 0.8 }, cardSub: { color: '#FFF', fontSize: 13, marginTop: 15 },
  balanceText: { color: '#FFF', fontSize: 22, fontWeight: 'bold' }, cardLink: { color: '#FFF', textDecorationLine: 'underline', fontSize: 14 },
  investCard: { width: width * 0.5, backgroundColor: '#F0F0F0', borderRadius: 20, padding: 20, marginRight: 20, height: 160 },
  investTitle: { fontSize: 12, color: '#666' }, investSub: { fontSize: 14, color: '#333', marginTop: 15, marginBottom: 10 }, investLink: { color: '#4A148C', fontWeight: 'bold' },
  paySection: { padding: 20, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 15 }, subTabRow: { flexDirection: 'row', marginBottom: 20 },
  subTabActive: { color: '#4A148C', fontWeight: 'bold', marginRight: 20, borderBottomWidth: 2, borderBottomColor: '#4A148C' },
  subTabText: { color: '#888', marginRight: 20 }, upiAlert: { flexDirection: 'row', backgroundColor: '#FBE9E7', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  upiAlertText: { flex: 1, fontSize: 12, color: '#333', marginLeft: 8 }, activateText: { color: '#4A148C', fontWeight: 'bold', fontSize: 12 },
  upiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dashGridItem: { width: '23%', alignItems: 'center', marginBottom: 20 },
  dashIconCircle: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F3E5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  dashGridLabel: { fontSize: 10, textAlign: 'center', color: '#555' }, bottomNavDash: { flexDirection: 'row', height: 75, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#EEE', paddingBottom: 10, alignItems: 'center' },
  fabContainerDash: { flex: 1, alignItems: 'center', marginTop: -25 }, fabDash: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#6A1B9A', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  fabLabelDash: { fontSize: 10, color: '#6A1B9A', fontWeight: 'bold', marginTop: 4 },
  transHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  transHeaderText: { fontSize: 20, fontWeight: 'bold', color: '#333', flex: 1, marginLeft: 15 },
  transTabs: { flexDirection: 'row', paddingHorizontal: 20, borderBottomWidth: 1, borderColor: '#EEE', paddingBottom: 0 },
  transTabActive: { fontSize: 15, color: '#4A148C', fontWeight: 'bold', paddingBottom: 8 },
  transTabText: { fontSize: 15, color: '#888', marginLeft: 30, paddingBottom: 8 },
  accountSelectorCard: { margin: 15, backgroundColor: '#F0F2F5', borderRadius: 12, padding: 15, borderBottomWidth: 2, borderColor: '#BA68C8' },
  selectAccountLabel: { fontSize: 14, color: '#555', marginBottom: 10 }, accountBox: { flexDirection: 'row', alignItems: 'center' },
  sbiIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00A1E1', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  sbiMiniLogo: { width: 25, height: 25, tintColor: '#FFF' }, accountNumber: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  accountType: { fontSize: 12, color: '#777', marginTop: 2 }, availableBalanceLabel: { fontSize: 12, color: '#777', marginTop: 2 },
  searchContainer: { flexDirection: 'row', paddingHorizontal: 15, alignItems: 'center', marginBottom: 15 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F2F5', borderRadius: 8, paddingHorizontal: 12, height: 45 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14 }, recentTransHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, alignItems: 'center', marginBottom: 15 },
  recentTransText: { fontSize: 16, fontWeight: 'bold', color: '#4A148C', marginRight: 5 },
  requestStatementBtn: { borderWidth: 1, borderColor: '#4A148C', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 8 },
  requestStatementText: { color: '#4A148C', fontWeight: 'bold', fontSize: 12 },
  dateSeparator: { backgroundColor: '#F0F2F5', paddingVertical: 10, paddingHorizontal: 15 }, dateText: { fontSize: 13, color: '#666', fontWeight: 'bold' },
  transItem: { padding: 15, borderBottomWidth: 1, borderColor: '#EEE' }, upiTag: { backgroundColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 5 },
  upiTagText: { fontSize: 10, color: '#888' }, transTitle: { fontSize: 14, color: '#333', fontWeight: '500' }, transDate: { fontSize: 11, color: '#888', marginTop: 4 },
  transAmount: { fontSize: 15, color: '#4A148C', fontWeight: 'bold' }, transBalance: { fontSize: 11, color: '#888', marginTop: 4 }, alignEnd: { alignItems: 'flex-end' },
  requestHeaderText: { fontSize: 20, fontWeight: 'bold', color: '#4A148C', flex: 1, marginLeft: 10 },
  formGroup: { marginBottom: 25 },
  labelSmall: { fontSize: 14, color: '#666', marginLeft: 10 },
  labelVerySmall: { fontSize: 12, color: '#888', marginBottom: 8 },
  radioCircle: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: '#888' },
  picker: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#DDD', paddingVertical: 10, marginTop: 5 },
  pickerText: { fontSize: 16, color: '#333' },
  switchLabel: { fontSize: 14, color: '#333' },
  passLogicText: { fontSize: 14, color: '#666' },
  infoBox: { flexDirection: 'row', backgroundColor: '#F3E5F5', padding: 15, borderRadius: 8, marginVertical: 20, alignItems: 'center' },
  infoBoxText: { flex: 1, fontSize: 12, color: '#4A148C', marginLeft: 10 },
  outlineBtn: { width: '48%', borderWidth: 1, borderColor: '#CCC', borderRadius: 25, paddingVertical: 12, alignItems: 'center' },
  outlineBtnText: { color: '#888', fontWeight: 'bold', fontSize: 15 },
  digiLockerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 15, borderRadius: 8, marginTop: 20 },
  digiText: { color: '#4A148C', fontSize: 14 },
  digiBrand: { backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4, borderLeftWidth: 3, borderLeftColor: '#4A148C' },
  digiMiniText: { fontSize: 10, color: '#4A148C', fontWeight: 'bold' },
  dropdownList: { backgroundColor: '#FFF', elevation: 3, borderRadius: 4, marginTop: 5 },
  dropdownItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  dashboardBanner: { width: '100%', height: 120, borderRadius: 12, marginTop: 10, overflow: 'hidden' },
});