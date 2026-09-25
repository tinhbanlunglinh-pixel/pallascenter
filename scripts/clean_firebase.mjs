// Script to inspect and wipe all old/mock data from Firebase Realtime Database
const FIREBASE_URL = 'https://english-mrs-dung-default-rtdb.asia-southeast1.firebasedatabase.app';
const API_KEY = 'AIzaSyAwl9RWxJATZbh_OD7cfOVN_ikC4InK_4k';

const COLLECTIONS = [
  'classes',
  'students',
  'assignments',
  'submissions',
  'monthly_reports',
  'weekly_reports',
  'annual_reports',
  'class_schedules',
  'attendance_records',
  'admin_notifications',
  'deleted_students',
  'deleted_submissions',
  'deleted_assignments',
  'deleted_classes'
];

async function inspectAndWipe() {
  console.log('=== 1. KIỂM TRA TRẠNG THÁI HIỆN TẠI TRÊN FIREBASE ===');
  for (const col of COLLECTIONS) {
    try {
      const res = await fetch(`${FIREBASE_URL}/${col}.json?shallow=true&auth=${API_KEY}`);
      const data = await res.json();
      const count = data ? (Array.isArray(data) ? data.length : Object.keys(data).length) : 0;
      console.log(`Node [${col}]: ${count} mục`);
    } catch (e) {
      console.error(`Lỗi kiểm tra [${col}]:`, e.message);
    }
  }

  console.log('\n=== 2. TIẾN HÀNH XÓA SẠCH DỮ LIỆU CŨ TRÊN FIREBASE ===');
  for (const col of COLLECTIONS) {
    try {
      const res = await fetch(`${FIREBASE_URL}/${col}.json?auth=${API_KEY}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        console.log(`Đã xóa sạch node [${col}]`);
      } else {
        const text = await res.text();
        console.error(`Xóa [${col}] thất bại: HTTP ${res.status} - ${text}`);
      }
    } catch (e) {
      console.error(`Lỗi khi xóa [${col}]:`, e.message);
    }
  }

  console.log('\n=== 3. XÁC MINH LẠI SAU KHI XÓA ===');
  let allClean = true;
  for (const col of COLLECTIONS) {
    try {
      const res = await fetch(`${FIREBASE_URL}/${col}.json?shallow=true&auth=${API_KEY}`);
      const data = await res.json();
      if (data !== null) {
        const count = Array.isArray(data) ? data.length : Object.keys(data).length;
        if (count > 0) {
          console.warn(`Node [${col}] VẪN CÒN ${count} mục!`);
          allClean = false;
        } else {
          console.log(`Node [${col}]: ĐÃ TRẮNG HOÀN TOÀN`);
        }
      } else {
        console.log(`Node [${col}]: ĐÃ TRẮNG HOÀN TOÀN (null)`);
      }
    } catch (e) {
      console.error(`Lỗi xác minh [${col}]:`, e.message);
    }
  }

  if (allClean) {
    console.log('\n>>> KẾT QUẢ: TOÀN BỘ 14 NODE DỮ LIỆU ĐÃ ĐƯỢC XÓA TRẮNG TRÊN FIREBASE! <<<');
  } else {
    console.error('\n>>> CẢNH BÁO: MỘT SỐ NODE CHƯA SẠCH HOÀN TOÀN! <<<');
  }
}

inspectAndWipe();
