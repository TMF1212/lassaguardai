
-- Add user_id to risk_assessments (nullable so anonymous assessments still work)
ALTER TABLE public.risk_assessments ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Allow authenticated users to read their own assessments
CREATE POLICY "Users can read own assessments"
ON public.risk_assessments
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create alert_subscriptions table for SMS/WhatsApp alerts
CREATE TABLE public.alert_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  alert_type TEXT NOT NULL DEFAULT 'sms' CHECK (alert_type IN ('sms', 'whatsapp')),
  state TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.alert_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to subscribe (public health tool)
CREATE POLICY "Anyone can subscribe to alerts"
ON public.alert_subscriptions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
