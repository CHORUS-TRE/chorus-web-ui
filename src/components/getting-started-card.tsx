'use client'

import React from 'react'
import { CardComponentProps } from 'node_modules/nextstepjs/src/types'

import { useAppState } from './store/app-state-context'
import { Button } from './button'

const GettingStartedCard: React.FC<CardComponentProps> = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow
}) => {
  const { setHasSeenGettingStartedTour } = useAppState()

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow:
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        padding: '1rem',
        maxWidth: '32rem',
        minWidth: '16rem'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem'
        }}
      >
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>
          {step.title}
        </h2>
        {step.icon && <span style={{ fontSize: '1.5rem' }}>{step.icon}</span>}
      </div>

      <div style={{ marginBottom: '1rem', fontSize: '0.875rem' }}>
        {step.content}
      </div>

      {/* <div
        style={{
          marginBottom: '1rem',
          backgroundColor: '#E5E7EB',
          borderRadius: '9999px',
          height: '0.625rem',
        }}
      >
        <div
          style={{
            backgroundColor: '#2563EB',
            height: '0.625rem',
            borderRadius: '9999px',
            width: `${((currentStep + 1) / totalSteps) * 100}%`,
          }}
        ></div>
      </div> */}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          fontSize: '0.75rem'
        }}
      >
        {currentStep !== 0 && (
          <button
            onClick={prevStep}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: '500',
              color: '#4B5563',
              backgroundColor: '#F3F4F6',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: step.showControls ? 'block' : 'none'
            }}
            disabled={currentStep === 0}
          >
            Previous
          </button>
        )}
        <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>
          {/* {currentStep + 1} of {totalSteps} */}
        </span>
        {currentStep === totalSteps - 1 ? (
          <Button
            onClick={() => {
              skipTour?.()
              setHasSeenGettingStartedTour(true)
            }}
            className="bg-primary text-white"
          >
            Close
          </Button>
        ) : (
          <button
            onClick={nextStep}
            style={{
              padding: '0.5rem 1rem',
              fontWeight: '500',
              color: 'white',
              backgroundColor: '#2563EB',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: step.showControls ? 'block' : 'none'
            }}
          >
            Next
          </button>
        )}
      </div>

      <svg
        viewBox="0 0 54 54"
        data-name="nextstep-arrow"
        className="absolute right-[-23px] top-1/2 h-6 w-6 origin-center -translate-y-1/2 rotate-0"
      >
        <path id="triangle" d="M27 27L0 0V54L27 27Z" fill="white"></path>
      </svg>

      {skipTour && currentStep < totalSteps - 1 && (
        <button
          onClick={skipTour}
          style={{
            marginTop: '1rem',
            fontSize: '0.75rem',
            width: '100%',
            padding: '0.5rem 1rem',
            fontWeight: '500',
            color: '#4B5563',
            backgroundColor: '#F3F4F6',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            display: step.showSkip ? 'block' : 'none'
          }}
        >
          Skip Tour
        </button>
      )}
    </div>
  )
}

export default GettingStartedCard
