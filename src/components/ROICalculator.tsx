
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, TrendingUp, DollarSign, Clock, Users, Target } from 'lucide-react';

export function ROICalculator() {
  const [inputs, setInputs] = useState({
    annualRevenue: '',
    teamSize: '',
    currentToolsCost: '',
    marketingBudget: '',
    timeSpentOnTasks: '',
    industry: ''
  });

  const [results, setResults] = useState<any>(null);

  const calculateROI = () => {
    const revenue = parseFloat(inputs.annualRevenue) || 0;
    const team = parseInt(inputs.teamSize) || 1;
    const currentCosts = parseFloat(inputs.currentToolsCost) || 0;
    const budget = parseFloat(inputs.marketingBudget) || 0;
    const timeSpent = parseFloat(inputs.timeSpentOnTasks) || 0;

    // Determine PRAVADO pricing tier
    let pravadoCost = 199;
    if (revenue >= 50000000) pravadoCost = 1499;
    else if (revenue >= 25000000) pravadoCost = 999;
    else if (revenue >= 10000000) pravadoCost = 499;

    // Calculate savings and efficiency gains
    const annualPravadoCost = pravadoCost * 12;
    const annualCurrentCosts = currentCosts * 12;
    const toolSavings = Math.max(0, annualCurrentCosts - annualPravadoCost);

    // Time savings calculation (average 40% efficiency gain)
    const avgSalary = 75000; // Mid-market average marketing salary
    const timeSavingsValue = (timeSpent * 0.4 * team * avgSalary) / 52;

    // Revenue impact (average 15% increase in marketing efficiency)
    const revenueImpact = (budget * 0.15);

    const totalBenefits = toolSavings + timeSavingsValue + revenueImpact;
    const roi = ((totalBenefits - annualPravadoCost) / annualPravadoCost) * 100;
    const paybackPeriod = annualPravadoCost / (totalBenefits / 12);

    setResults({
      pravadoCost,
      annualPravadoCost,
      toolSavings,
      timeSavingsValue,
      revenueImpact,
      totalBenefits,
      roi,
      paybackPeriod: Math.max(0.1, paybackPeriod)
    });
  };

  const getRecommendedPlan = () => {
    const revenue = parseFloat(inputs.annualRevenue) || 0;
    if (revenue >= 50000000) return 'Scale';
    if (revenue >= 25000000) return 'Growth';
    if (revenue >= 10000000) return 'Professional';
    return 'Starter';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">ROI Calculator</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate your potential return on investment with PRAVADO's marketing operating system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-pravado-purple" />
              <span>Your Company Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="revenue">Annual Revenue ($)</Label>
              <Input
                id="revenue"
                type="number"
                placeholder="25000000"
                value={inputs.annualRevenue}
                onChange={(e) => setInputs({...inputs, annualRevenue: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="team">Marketing Team Size</Label>
              <Input
                id="team"
                type="number"
                placeholder="8"
                value={inputs.teamSize}
                onChange={(e) => setInputs({...inputs, teamSize: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="tools">Current Monthly Tool Costs ($)</Label>
              <Input
                id="tools"
                type="number"
                placeholder="2500"
                value={inputs.currentToolsCost}
                onChange={(e) => setInputs({...inputs, currentToolsCost: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="budget">Monthly Marketing Budget ($)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="50000"
                value={inputs.marketingBudget}
                onChange={(e) => setInputs({...inputs, marketingBudget: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="time">Hours/Week on Marketing Operations</Label>
              <Input
                id="time"
                type="number"
                placeholder="20"
                value={inputs.timeSpentOnTasks}
                onChange={(e) => setInputs({...inputs, timeSpentOnTasks: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry</Label>
              <Select value={inputs.industry} onValueChange={(value) => setInputs({...inputs, industry: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="professional-services">Professional Services</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={calculateROI} 
              className="w-full bg-pravado-purple hover:bg-pravado-purple/90 text-white"
              disabled={!inputs.annualRevenue || !inputs.teamSize}
            >
              Calculate My ROI
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-pravado-purple" />
              <span>Your ROI Projection</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{results.roi.toFixed(0)}%</div>
                    <div className="text-sm text-green-700">Annual ROI</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.paybackPeriod.toFixed(1)}</div>
                    <div className="text-sm text-blue-700">Months to Payback</div>
                  </div>
                </div>

                {/* Recommended Plan */}
                <div className="bg-pravado-purple/10 p-4 rounded-lg">
                  <h4 className="font-semibold text-pravado-purple mb-2">Recommended Plan: {getRecommendedPlan()}</h4>
                  <div className="text-2xl font-bold text-pravado-purple">${results.pravadoCost}/month</div>
                  <div className="text-sm text-gray-600">Perfect for your company size and revenue</div>
                </div>

                {/* Savings Breakdown */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-foreground">Annual Savings & Benefits:</h4>
                  
                  <div className="flex justify-between items-center p-3 bg-soft-gray rounded">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Tool Cost Savings</span>
                    </div>
                    <span className="font-semibold text-green-600">
                      ${results.toolSavings.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-soft-gray rounded">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Time Efficiency Value</span>
                    </div>
                    <span className="font-semibold text-blue-600">
                      ${results.timeSavingsValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-soft-gray rounded">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4 text-pravado-orange" />
                      <span className="text-sm">Revenue Impact</span>
                    </div>
                    <span className="font-semibold text-pravado-orange">
                      ${results.revenueImpact.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center font-semibold">
                      <span>Total Annual Value</span>
                      <span className="text-lg text-pravado-purple">
                        ${results.totalBenefits.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-pravado-purple hover:bg-pravado-purple/90 text-white">
                  Start My 30-Day Quick Start
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Fill in your company details to see your personalized ROI calculation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
