import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Initialize Supabase Client
// ملاحظة: استبدل هذه بـ keys الحقيقية الخاصة بك من Supabase
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_KEY = 'your-anon-key';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ==================== STYLES ====================
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary: #7B68EE;
    --primary-dark: #5B4FC4;
    --primary-light: #E8E4FC;
    --secondary: #F8F9FA;
    --success: #28A745;
    --danger: #DC3545;
    --warning: #FD7E14;
    --dark: #1A1A2E;
    --gray: #6C757D;
    --light-gray: #E9ECEF;
    --white: #FFFFFF;
    --shadow: 0 4px 20px rgba(123, 104, 238, 0.15);
    --radius: 16px;
  }

  body {
    font-family: 'Tajawal', 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 50%, #F0EEFC 100%);
    color: var(--dark);
    direction: rtl;
  }

  .app-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .sidebar {
    width: 260px;
    background: var(--white);
    box-shadow: var(--shadow);
    border-left: 2px solid var(--primary-light);
    overflow-y: auto;
    padding: 20px 0;
  }

  .sidebar-header {
    padding: 20px 16px;
    text-align: center;
    background: linear-gradient(135deg, #7B68EE 0%, #9B8AF7 100%);
    color: white;
    margin-bottom: 20px;
    border-radius: 12px;
    margin: 10px;
  }

  .sidebar-header h2 {
    font-size: 18px;
    font-weight: 800;
    margin-bottom: 4px;
  }

  .sidebar-header p {
    font-size: 11px;
    opacity: 0.9;
  }

  .nav-menu {
    display: flex;
    flex-direction: column;
    padding: 10px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    margin-bottom: 4px;
    border-radius: var(--radius);
    cursor: pointer;
    transition: all 0.3s ease;
    color: var(--gray);
    font-weight: 500;
    border-right: 3px solid transparent;
  }

  .nav-item:hover {
    background: var(--primary-light);
    color: var(--primary-dark);
  }

  .nav-item.active {
    background: var(--primary-light);
    color: var(--primary);
    font-weight: 700;
    border-right-color: var(--primary);
  }

  .nav-item i {
    font-size: 18px;
    width: 22px;
    text-align: center;
  }

  .main-content {
    flex: 1;
    margin-right: 260px;
    padding: 20px 28px;
    overflow-y: auto;
    min-height: 100vh;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    padding: 14px 20px;
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    flex-wrap: wrap;
    gap: 12px;
  }

  .page-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--dark);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .page-title i {
    color: var(--primary);
    font-size: 24px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
  }

  .btn-primary {
    background: linear-gradient(135deg, #7B68EE 0%, #9B8AF7 100%);
    color: var(--white);
    box-shadow: 0 4px 15px rgba(123, 104, 238, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(123, 104, 238, 0.4);
  }

  .btn-outline {
    background: transparent;
    border: 2px solid var(--primary);
    color: var(--primary);
  }

  .btn-outline:hover {
    background: var(--primary);
    color: var(--white);
  }

  .btn-sm {
    padding: 6px 14px;
    font-size: 13px;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
  }

  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(123, 104, 238, 0.2);
  }

  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: 12px;
  }

  .card-icon.primary {
    background: var(--primary-light);
    color: var(--primary);
  }

  .card-icon.success {
    background: #D4EDDA;
    color: var(--success);
  }

  .card-icon.danger {
    background: #F8D7DA;
    color: var(--danger);
  }

  .card-icon.warning {
    background: #FFF3CD;
    color: var(--warning);
  }

  .card-label {
    font-size: 12px;
    color: var(--gray);
    margin-bottom: 4px;
    text-transform: uppercase;
    font-weight: 700;
  }

  .card-value {
    font-size: 24px;
    font-weight: 800;
    color: var(--dark);
  }

  .table-container {
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  .table th {
    background: var(--primary-light);
    color: var(--primary);
    padding: 14px;
    text-align: right;
    font-weight: 700;
    font-size: 13px;
  }

  .table td {
    padding: 14px;
    border-bottom: 1px solid var(--light-gray);
  }

  .table tbody tr:hover {
    background: var(--secondary);
  }

  .status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 700;
  }

  .status-active {
    background: #D4EDDA;
    color: var(--success);
  }

  .status-pending {
    background: #FFF3CD;
    color: var(--warning);
  }

  .status-completed {
    background: #D1ECF1;
    color: var(--info);
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
  }

  .modal-overlay.hidden {
    display: none;
  }

  .modal {
    background: var(--white);
    border-radius: var(--radius);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: modalSlide 0.3s ease;
  }

  @keyframes modalSlide {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    padding: 20px;
    border-bottom: 2px solid var(--primary-light);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    font-size: 18px;
    font-weight: 800;
    color: var(--dark);
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--gray);
  }

  .modal-body {
    padding: 20px;
  }

  .modal-footer {
    padding: 20px;
    border-top: 1px solid var(--light-gray);
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    margin-bottom: 6px;
    font-weight: 600;
    color: var(--dark);
    font-size: 14px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 12px;
    border: 2px solid var(--light-gray);
    border-radius: 10px;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }

  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--gray);
  }

  .empty-state-icon {
    font-size: 48px;
    margin-bottom: 12px;
    opacity: 0.5;
  }

  .empty-state-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 8px;
  }

  .empty-state-text {
    font-size: 14px;
    margin-bottom: 20px;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  .chart-container {
    background: var(--white);
    border-radius: var(--radius);
    padding: 20px;
    box-shadow: var(--shadow);
  }

  .chart-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--dark);
    margin-bottom: 16px;
  }

  @media (max-width: 768px) {
    .sidebar {
      position: fixed;
      right: 0;
      top: 0;
      height: 100vh;
      z-index: 999;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }

    .sidebar.active {
      transform: translateX(0);
    }

    .main-content {
      margin-right: 0;
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
    }

    .cards-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .modal {
      width: 95%;
      max-height: 95vh;
    }
  }
`;

// ==================== MAIN COMPONENT ====================
export default function BusinessManager() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [loginPage, setLoginPage] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);

  // ============ DASHBOARD STATE ============
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    activeProjects: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });

  // ============ CLIENTS STATE ============
  const [clients, setClients] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [editingClient, setEditingClient] = useState(null);

  // ============ PROJECTS STATE ============
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: '', clientId: '', status: 'نشط', budget: '', description: '' });
  const [editingProject, setEditingProject] = useState(null);

  // ============ INVOICES STATE ============
  const [invoices, setInvoices] = useState([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({ projectId: '', amount: '', status: 'معلق', dueDate: '', notes: '' });
  const [editingInvoice, setEditingInvoice] = useState(null);

  // ============ QUOTATIONS STATE ============
  const [quotations, setQuotations] = useState([]);
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationForm, setQuotationForm] = useState({ clientId: '', description: '', amount: '', expiryDate: '', notes: '' });
  const [editingQuotation, setEditingQuotation] = useState(null);

  // ============ AUTHENTICATION ============
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser(data.user);
      setLoginPage(false);
    } catch (error) {
      alert('خطأ في تسجيل الدخول: ' + error.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      alert('تم التسجيل بنجاح! يرجى تسجيل الدخول.');
      setEmail('');
      setPassword('');
    } catch (error) {
      alert('خطأ في التسجيل: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoginPage(true);
  };

  // ============ FETCH DATA ============
  useEffect(() => {
    if (user) {
      fetchClients();
      fetchProjects();
      fetchInvoices();
      fetchQuotations();
    }
  }, [user]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('خطأ في جلب العملاء:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('خطأ في جلب المشاريع:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('خطأ في جلب الفواتير:', error);
    }
  };

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('user_id', user.id);
      if (error) throw error;
      setQuotations(data || []);
    } catch (error) {
      console.error('خطأ في جلب عروض الأسعار:', error);
    }
  };

  // ============ CLIENT OPERATIONS ============
  const saveClient = async () => {
    if (!clientForm.name) return alert('الرجاء إدخال اسم العميل');
    try {
      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(clientForm)
          .eq('id', editingClient.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('clients')
          .insert([{ ...clientForm, user_id: user.id }]);
        if (error) throw error;
      }
      setShowClientModal(false);
      setClientForm({ name: '', email: '', phone: '', address: '' });
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      alert('خطأ في حفظ العميل: ' + error.message);
    }
  };

  const deleteClient = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      fetchClients();
    } catch (error) {
      alert('خطأ في حذف العميل: ' + error.message);
    }
  };

  const editClient = (client) => {
    setClientForm(client);
    setEditingClient(client);
    setShowClientModal(true);
  };

  // ============ PROJECT OPERATIONS ============
  const saveProject = async () => {
    if (!projectForm.name) return alert('الرجاء إدخال اسم المشروع');
    try {
      if (editingProject) {
        const { error } = await supabase
          .from('projects')
          .update(projectForm)
          .eq('id', editingProject.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('projects')
          .insert([{ ...projectForm, user_id: user.id }]);
        if (error) throw error;
      }
      setShowProjectModal(false);
      setProjectForm({ name: '', clientId: '', status: 'نشط', budget: '', description: '' });
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      alert('خطأ في حفظ المشروع: ' + error.message);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchProjects();
    } catch (error) {
      alert('خطأ في حذف المشروع: ' + error.message);
    }
  };

  const editProject = (project) => {
    setProjectForm(project);
    setEditingProject(project);
    setShowProjectModal(true);
  };

  // ============ INVOICE OPERATIONS ============
  const saveInvoice = async () => {
    if (!invoiceForm.projectId || !invoiceForm.amount) return alert('الرجاء ملء البيانات المطلوبة');
    try {
      if (editingInvoice) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceForm)
          .eq('id', editingInvoice.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('invoices')
          .insert([{ ...invoiceForm, user_id: user.id }]);
        if (error) throw error;
      }
      setShowInvoiceModal(false);
      setInvoiceForm({ projectId: '', amount: '', status: 'معلق', dueDate: '', notes: '' });
      setEditingInvoice(null);
      fetchInvoices();
    } catch (error) {
      alert('خطأ في حفظ الفاتورة: ' + error.message);
    }
  };

  const deleteInvoice = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      fetchInvoices();
    } catch (error) {
      alert('خطأ في حذف الفاتورة: ' + error.message);
    }
  };

  const editInvoice = (invoice) => {
    setInvoiceForm(invoice);
    setEditingInvoice(invoice);
    setShowInvoiceModal(true);
  };

  // ============ QUOTATION OPERATIONS ============
  const saveQuotation = async () => {
    if (!quotationForm.clientId || !quotationForm.amount) return alert('الرجاء ملء البيانات المطلوبة');
    try {
      if (editingQuotation) {
        const { error } = await supabase
          .from('quotations')
          .update(quotationForm)
          .eq('id', editingQuotation.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('quotations')
          .insert([{ ...quotationForm, user_id: user.id }]);
        if (error) throw error;
      }
      setShowQuotationModal(false);
      setQuotationForm({ clientId: '', description: '', amount: '', expiryDate: '', notes: '' });
      setEditingQuotation(null);
      fetchQuotations();
    } catch (error) {
      alert('خطأ في حفظ عرض السعر: ' + error.message);
    }
  };

  const deleteQuotation = async (id) => {
    if (!confirm('هل أنت متأكد؟')) return;
    try {
      const { error } = await supabase.from('quotations').delete().eq('id', id);
      if (error) throw error;
      fetchQuotations();
    } catch (error) {
      alert('خطأ في حذف عرض السعر: ' + error.message);
    }
  };

  const editQuotation = (quotation) => {
    setQuotationForm(quotation);
    setEditingQuotation(quotation);
    setShowQuotationModal(true);
  };

  // ============ RENDER LOGIN PAGE ============
  if (loginPage) {
    return (
      <>
        <style>{styles}</style>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.95)', borderRadius: 'var(--radius)', padding: '40px 30px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>💼</div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: 'var(--dark)', marginBottom: '8px' }}>مدير الأعمال</h1>
            <p style={{ fontSize: '14px', color: 'var(--gray)', marginBottom: '30px' }}>نظام إدارة متكامل مع Supabase</p>

            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '20px', textAlign: 'right' }}>
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '2px solid var(--light-gray)', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>
              <div style={{ marginBottom: '20px', textAlign: 'right', position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '2px solid var(--light-gray)', borderRadius: '10px', fontFamily: 'inherit', fontSize: '14px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: 'var(--gray)' }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '12px' }}>
                تسجيل الدخول
              </button>
            </form>

            <button onClick={handleRegister} className="btn btn-outline" style={{ width: '100%' }}>
              إنشاء حساب جديد
            </button>

            <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--gray)' }}>
              استخدم بيانات اختبارية عند الحاجة
            </p>
          </div>
        </div>
      </>
    );
  }

  // ============ RENDER MAIN APP ============
  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>💼 مدير الأعمال</h2>
            <p>نظام الإدارة المتكامل</p>
          </div>

          <nav className="nav-menu">
            <div
              className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              <i className="fas fa-home"></i> لوحة التحكم
            </div>
            <div
              className={`nav-item ${currentPage === 'clients' ? 'active' : ''}`}
              onClick={() => setCurrentPage('clients')}
            >
              <i className="fas fa-users"></i> العملاء
            </div>
            <div
              className={`nav-item ${currentPage === 'projects' ? 'active' : ''}`}
              onClick={() => setCurrentPage('projects')}
            >
              <i className="fas fa-tasks"></i> المشاريع
            </div>
            <div
              className={`nav-item ${currentPage === 'invoices' ? 'active' : ''}`}
              onClick={() => setCurrentPage('invoices')}
            >
              <i className="fas fa-file-invoice"></i> الفواتير
            </div>
            <div
              className={`nav-item ${currentPage === 'quotations' ? 'active' : ''}`}
              onClick={() => setCurrentPage('quotations')}
            >
              <i className="fas fa-file-alt"></i> عروض الأسعار
            </div>
            <div className="nav-item" onClick={handleLogout} style={{ marginTop: '20px', color: 'var(--danger)' }}>
              <i className="fas fa-sign-out-alt"></i> تسجيل الخروج
            </div>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {/* TOP BAR */}
          <div className="top-bar">
            <h1 className="page-title">
              {currentPage === 'dashboard' && '📊 لوحة التحكم'}
              {currentPage === 'clients' && '👥 العملاء'}
              {currentPage === 'projects' && '📋 المشاريع'}
              {currentPage === 'invoices' && '💰 الفواتير'}
              {currentPage === 'quotations' && '📄 عروض الأسعار'}
            </h1>
            <div className="top-actions">
              {currentPage === 'clients' && (
                <button className="btn btn-primary" onClick={() => { setShowClientModal(true); setEditingClient(null); setClientForm({ name: '', email: '', phone: '', address: '' }); }}>
                  <i className="fas fa-plus"></i> عميل جديد
                </button>
              )}
              {currentPage === 'projects' && (
                <button className="btn btn-primary" onClick={() => { setShowProjectModal(true); setEditingProject(null); setProjectForm({ name: '', clientId: '', status: 'نشط', budget: '', description: '' }); }}>
                  <i className="fas fa-plus"></i> مشروع جديد
                </button>
              )}
              {currentPage === 'invoices' && (
                <button className="btn btn-primary" onClick={() => { setShowInvoiceModal(true); setEditingInvoice(null); setInvoiceForm({ projectId: '', amount: '', status: 'معلق', dueDate: '', notes: '' }); }}>
                  <i className="fas fa-plus"></i> فاتورة جديدة
                </button>
              )}
              {currentPage === 'quotations' && (
                <button className="btn btn-primary" onClick={() => { setShowQuotationModal(true); setEditingQuotation(null); setQuotationForm({ clientId: '', description: '', amount: '', expiryDate: '', notes: '' }); }}>
                  <i className="fas fa-plus"></i> عرض سعر جديد
                </button>
              )}
            </div>
          </div>

          {/* DASHBOARD PAGE */}
          {currentPage === 'dashboard' && (
            <>
              <div className="cards-grid">
                <div className="card">
                  <div className="card-icon primary"><i className="fas fa-users"></i></div>
                  <div className="card-label">إجمالي العملاء</div>
                  <div className="card-value">{clients.length}</div>
                </div>
                <div className="card">
                  <div className="card-icon success"><i className="fas fa-tasks"></i></div>
                  <div className="card-label">المشاريع النشطة</div>
                  <div className="card-value">{projects.filter(p => p.status === 'نشط').length}</div>
                </div>
                <div className="card">
                  <div className="card-icon danger"><i className="fas fa-file-invoice"></i></div>
                  <div className="card-label">الفواتير المعلقة</div>
                  <div className="card-value">{invoices.filter(i => i.status === 'معلق').length}</div>
                </div>
                <div className="card">
                  <div className="card-icon warning"><i className="fas fa-file-alt"></i></div>
                  <div className="card-label">عروض الأسعار</div>
                  <div className="card-value">{quotations.length}</div>
                </div>
              </div>

              <div className="dashboard-grid">
                <div className="chart-container">
                  <div className="chart-title">توزيع حالة المشاريع</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'نشط', value: projects.filter(p => p.status === 'نشط').length },
                          { name: 'مكتمل', value: projects.filter(p => p.status === 'مكتمل').length },
                          { name: 'معلق', value: projects.filter(p => p.status === 'معلق').length },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#7B68EE" />
                        <Cell fill="#28A745" />
                        <Cell fill="#FD7E14" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <div className="chart-title">إجمالي الفواتير بالحالة</div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        { name: 'معلق', value: invoices.filter(i => i.status === 'معلق').length },
                        { name: 'مدفوع', value: invoices.filter(i => i.status === 'مدفوع').length },
                        { name: 'متأخر', value: invoices.filter(i => i.status === 'متأخر').length },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#7B68EE" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* CLIENTS PAGE */}
          {currentPage === 'clients' && (
            <>
              {clients.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <div className="empty-state-title">لا توجد عملاء بعد</div>
                  <div className="empty-state-text">أضف عميلك الأول لبدء الإدارة</div>
                  <button className="btn btn-primary" onClick={() => { setShowClientModal(true); setEditingClient(null); setClientForm({ name: '', email: '', phone: '', address: '' }); }}>
                    <i className="fas fa-plus"></i> إضافة عميل
                  </button>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>الاسم</th>
                        <th>البريد الإلكتروني</th>
                        <th>الهاتف</th>
                        <th>العنوان</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id}>
                          <td>{client.name}</td>
                          <td>{client.email}</td>
                          <td>{client.phone}</td>
                          <td>{client.address}</td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => editClient(client)} style={{ marginRight: '5px' }}>
                              تعديل
                            </button>
                            <button className="btn btn-sm" style={{ background: '#DC3545', color: 'white' }} onClick={() => deleteClient(client.id)}>
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* PROJECTS PAGE */}
          {currentPage === 'projects' && (
            <>
              {projects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  <div className="empty-state-title">لا توجد مشاريع بعد</div>
                  <div className="empty-state-text">أضف مشروعك الأول</div>
                  <button className="btn btn-primary" onClick={() => { setShowProjectModal(true); setEditingProject(null); setProjectForm({ name: '', clientId: '', status: 'نشط', budget: '', description: '' }); }}>
                    <i className="fas fa-plus"></i> إضافة مشروع
                  </button>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>المشروع</th>
                        <th>العميل</th>
                        <th>الحالة</th>
                        <th>الميزانية</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td>{project.name}</td>
                          <td>{project.clientId}</td>
                          <td>
                            <span className={`status-badge status-${project.status === 'نشط' ? 'active' : project.status === 'معلق' ? 'pending' : 'completed'}`}>
                              {project.status}
                            </span>
                          </td>
                          <td>{project.budget}</td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => editProject(project)} style={{ marginRight: '5px' }}>
                              تعديل
                            </button>
                            <button className="btn btn-sm" style={{ background: '#DC3545', color: 'white' }} onClick={() => deleteProject(project.id)}>
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* INVOICES PAGE */}
          {currentPage === 'invoices' && (
            <>
              {invoices.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💰</div>
                  <div className="empty-state-title">لا توجد فواتير بعد</div>
                  <div className="empty-state-text">أضف فاتورتك الأولى</div>
                  <button className="btn btn-primary" onClick={() => { setShowInvoiceModal(true); setEditingInvoice(null); setInvoiceForm({ projectId: '', amount: '', status: 'معلق', dueDate: '', notes: '' }); }}>
                    <i className="fas fa-plus"></i> إضافة فاتورة
                  </button>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>المشروع</th>
                        <th>المبلغ</th>
                        <th>الحالة</th>
                        <th>تاريخ الاستحقاق</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td>{invoice.projectId}</td>
                          <td>{invoice.amount}</td>
                          <td>
                            <span className={`status-badge status-${invoice.status === 'معلق' ? 'pending' : invoice.status === 'مدفوع' ? 'completed' : 'active'}`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td>{invoice.dueDate}</td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => editInvoice(invoice)} style={{ marginRight: '5px' }}>
                              تعديل
                            </button>
                            <button className="btn btn-sm" style={{ background: '#DC3545', color: 'white' }} onClick={() => deleteInvoice(invoice.id)}>
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {/* QUOTATIONS PAGE */}
          {currentPage === 'quotations' && (
            <>
              {quotations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📄</div>
                  <div className="empty-state-title">لا توجد عروض أسعار بعد</div>
                  <div className="empty-state-text">أضف عرض سعر جديد</div>
                  <button className="btn btn-primary" onClick={() => { setShowQuotationModal(true); setEditingQuotation(null); setQuotationForm({ clientId: '', description: '', amount: '', expiryDate: '', notes: '' }); }}>
                    <i className="fas fa-plus"></i> إضافة عرض سعر
                  </button>
                </div>
              ) : (
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>العميل</th>
                        <th>الوصف</th>
                        <th>المبلغ</th>
                        <th>تاريخ الانتهاء</th>
                        <th>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quotations.map((quotation) => (
                        <tr key={quotation.id}>
                          <td>{quotation.clientId}</td>
                          <td>{quotation.description}</td>
                          <td>{quotation.amount}</td>
                          <td>{quotation.expiryDate}</td>
                          <td>
                            <button className="btn btn-sm btn-outline" onClick={() => editQuotation(quotation)} style={{ marginRight: '5px' }}>
                              تعديل
                            </button>
                            <button className="btn btn-sm" style={{ background: '#DC3545', color: 'white' }} onClick={() => deleteQuotation(quotation.id)}>
                              حذف
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* CLIENT MODAL */}
      {showClientModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingClient ? 'تعديل العميل' : 'عميل جديد'}</h3>
              <button className="modal-close" onClick={() => setShowClientModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">الاسم *</label>
                <input
                  className="form-input"
                  type="text"
                  value={clientForm.name}
                  onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                  placeholder="اسم العميل"
                />
              </div>
              <div className="form-group">
                <label className="form-label">البريد الإلكتروني</label>
                <input
                  className="form-input"
                  type="email"
                  value={clientForm.email}
                  onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                  placeholder="البريد الإلكتروني"
                />
              </div>
              <div className="form-group">
                <label className="form-label">الهاتف</label>
                <input
                  className="form-input"
                  type="tel"
                  value={clientForm.phone}
                  onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                  placeholder="رقم الهاتف"
                />
              </div>
              <div className="form-group">
                <label className="form-label">العنوان</label>
                <input
                  className="form-input"
                  type="text"
                  value={clientForm.address}
                  onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
                  placeholder="العنوان"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowClientModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={saveClient}>حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* PROJECT MODAL */}
      {showProjectModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingProject ? 'تعديل المشروع' : 'مشروع جديد'}</h3>
              <button className="modal-close" onClick={() => setShowProjectModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">اسم المشروع *</label>
                <input
                  className="form-input"
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  placeholder="اسم المشروع"
                />
              </div>
              <div className="form-group">
                <label className="form-label">العميل</label>
                <select
                  className="form-select"
                  value={projectForm.clientId}
                  onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                >
                  <option value="">اختر عميل</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">الحالة</label>
                <select
                  className="form-select"
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                >
                  <option value="نشط">نشط</option>
                  <option value="معلق">معلق</option>
                  <option value="مكتمل">مكتمل</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">الميزانية</label>
                <input
                  className="form-input"
                  type="number"
                  value={projectForm.budget}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                  placeholder="الميزانية"
                />
              </div>
              <div className="form-group">
                <label className="form-label">الوصف</label>
                <textarea
                  className="form-textarea"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  placeholder="وصف المشروع"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowProjectModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={saveProject}>حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* INVOICE MODAL */}
      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingInvoice ? 'تعديل الفاتورة' : 'فاتورة جديدة'}</h3>
              <button className="modal-close" onClick={() => setShowInvoiceModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">المشروع *</label>
                <select
                  className="form-select"
                  value={invoiceForm.projectId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, projectId: e.target.value })}
                >
                  <option value="">اختر مشروع</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">المبلغ *</label>
                <input
                  className="form-input"
                  type="number"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                  placeholder="المبلغ"
                />
              </div>
              <div className="form-group">
                <label className="form-label">الحالة</label>
                <select
                  className="form-select"
                  value={invoiceForm.status}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}
                >
                  <option value="معلق">معلق</option>
                  <option value="مدفوع">مدفوع</option>
                  <option value="متأخر">متأخر</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">تاريخ الاستحقاق</label>
                <input
                  className="form-input"
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ملاحظات</label>
                <textarea
                  className="form-textarea"
                  value={invoiceForm.notes}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
                  placeholder="ملاحظات"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowInvoiceModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={saveInvoice}>حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* QUOTATION MODAL */}
      {showQuotationModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">{editingQuotation ? 'تعديل عرض السعر' : 'عرض سعر جديد'}</h3>
              <button className="modal-close" onClick={() => setShowQuotationModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">العميل *</label>
                <select
                  className="form-select"
                  value={quotationForm.clientId}
                  onChange={(e) => setQuotationForm({ ...quotationForm, clientId: e.target.value })}
                >
                  <option value="">اختر عميل</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">الوصف</label>
                <textarea
                  className="form-textarea"
                  value={quotationForm.description}
                  onChange={(e) => setQuotationForm({ ...quotationForm, description: e.target.value })}
                  placeholder="وصف الخدمة"
                />
              </div>
              <div className="form-group">
                <label className="form-label">المبلغ *</label>
                <input
                  className="form-input"
                  type="number"
                  value={quotationForm.amount}
                  onChange={(e) => setQuotationForm({ ...quotationForm, amount: e.target.value })}
                  placeholder="المبلغ"
                />
              </div>
              <div className="form-group">
                <label className="form-label">تاريخ الانتهاء</label>
                <input
                  className="form-input"
                  type="date"
                  value={quotationForm.expiryDate}
                  onChange={(e) => setQuotationForm({ ...quotationForm, expiryDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">ملاحظات</label>
                <textarea
                  className="form-textarea"
                  value={quotationForm.notes}
                  onChange={(e) => setQuotationForm({ ...quotationForm, notes: e.target.value })}
                  placeholder="ملاحظات"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowQuotationModal(false)}>إلغاء</button>
              <button className="btn btn-primary" onClick={saveQuotation}>حفظ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
