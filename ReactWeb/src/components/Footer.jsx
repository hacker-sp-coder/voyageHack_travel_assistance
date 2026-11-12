import React from 'react';
import { IconGlobe, IconRefresh } from './Icons';

export function Footer({ onResetDemo }) {
  return (
    <footer className="site-footer">
      <div className="footer-top-grid">
        <div className="footer-col">
          <h4 className="footer-heading">Commercial Operations</h4>
          <ul className="footer-links">
            <li><a href="#directory">Terminal Concessions</a></li>
            <li><a href="#dutyfree">Duty Free Procurement</a></li>
            <li><a href="#analytics">Traveler Flow Analytics</a></li>
            <li><a href="#leasing">Airport Retail Leasing</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Retailer Hubs</h4>
          <ul className="footer-links">
            <li><a href="#lhr">London Heathrow (LHR)</a></li>
            <li><a href="#jfk">New York JFK (JFK)</a></li>
            <li><a href="#sin">Singapore Changi (SIN)</a></li>
            <li><a href="#dxb">Dubai International (DXB)</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4 className="footer-heading">Platform Administration</h4>
          <ul className="footer-links">
            <li><a href="#compliance">Security & TSA Compliance</a></li>
            <li><a href="#terms">Concessionaire Terms</a></li>
            <li><a href="#privacy">Passenger Privacy Policy</a></li>
            <li>
              <button 
                type="button" 
                className="footer-action-link" 
                onClick={onResetDemo}
              >
                <IconRefresh size={13} />
                <span>Restore Sample Directory</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom-band">
        <div className="footer-copyright">
          <span>© 2026 VoyageRetail Platform Inc. All rights reserved.</span>
          <span className="footer-bullet">•</span>
          <span>Air Commerce Management System</span>
        </div>

        <div className="footer-locale">
          <div className="locale-item">
            <IconGlobe size={15} />
            <span>English (US)</span>
          </div>
          <div className="locale-item">
            <span>$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
