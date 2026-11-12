import React from 'react';
import { IconMapPin, IconStore, IconPlane } from './Icons';

export function HubsView({ retailers, onSelectHub }) {
  const hubs = [
    {
      name: 'Heathrow Airport (LHR)',
      city: 'London, United Kingdom',
      terminals: 'Terminals 2, 3, 4, 5',
      traffic: '80.1M Passengers/yr',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'JFK International (JFK)',
      city: 'New York, United States',
      terminals: 'Terminals 1, 4, 7, 8',
      traffic: '61.9M Passengers/yr',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Dubai International (DXB)',
      city: 'Dubai, United Arab Emirates',
      terminals: 'Terminals 1, 2, 3 (Concourses A-D)',
      traffic: '87.0M Passengers/yr',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Singapore Changi (SIN)',
      city: 'Singapore',
      terminals: 'Terminals 1 - 4 & Jewel',
      traffic: '65.3M Passengers/yr',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Paris Charles de Gaulle (CDG)',
      city: 'Paris, France',
      terminals: 'Terminals 1, 2A-2G, 3',
      traffic: '67.4M Passengers/yr',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'Tokyo Haneda (HND)',
      city: 'Tokyo, Japan',
      terminals: 'Terminals 1, 2, 3',
      traffic: '78.7M Passengers/yr',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="hubs-view-container">
      <div className="section-header-block">
        <h2 className="section-title">International Airport Commercial Hubs</h2>
        <p className="section-subtitle">
          Manage retailer leases, terminal concessions, and traveler commercial density across global airport gateways.
        </p>
      </div>

      <div className="hubs-grid">
        {hubs.map((hub) => {
          const count = retailers.filter(r => r.hub === hub.name).length;
          return (
            <div key={hub.name} className="hub-card">
              <div className="hub-photo-wrapper">
                <img src={hub.image} alt={hub.name} className="hub-img" />
                <div className="hub-badge-count">
                  <IconStore size={13} />
                  <span>{count} Retailers</span>
                </div>
              </div>
              <div className="hub-body">
                <div className="hub-city-row">
                  <IconMapPin size={14} className="hub-pin" />
                  <span>{hub.city}</span>
                </div>
                <h3 className="hub-name">{hub.name}</h3>
                <div className="hub-meta-list">
                  <div className="hub-meta-item">
                    <span className="hub-meta-key">Terminals:</span>
                    <span className="hub-meta-val">{hub.terminals}</span>
                  </div>
                  <div className="hub-meta-item">
                    <span className="hub-meta-key">Annual Traffic:</span>
                    <span className="hub-meta-val">{hub.traffic}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-hub-view"
                  onClick={() => onSelectHub(hub.name)}
                >
                  <IconPlane size={15} />
                  <span>View Concessionaires ({count})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
